import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadFileToDrive, moveFileToDriveFolder } from "../services/drive";
import {
  extractTextFromPDF,
  extractTextFromDOCX,
} from "../services/extractors";
import { extractTagsWithGemini } from "../services/gemini";
import {
  saveDocumentMetadata,
  getAllDocumentsMetadata,
  getDocumentMetadata,
} from "../services/firestore";
import { google } from "googleapis";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = express.Router();
const upload = multer({ dest: "uploads/" });

function isString(val: any): val is string {
  return typeof val === "string";
}

router.post(
  "/upload",
  upload.single("file"),
  async (req: MulterRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileName = req.file.originalname || "untitled";
      const ext = path.extname(fileName).toLowerCase();

      // 1. Extract text
      let text = "";
      if (ext === ".pdf") {
        text = await extractTextFromPDF(req.file.path);
      } else if (ext === ".docx") {
        text = await extractTextFromDOCX(req.file.path);
      } else {
        text = "";
      }

      // 2. AI Tagging
      const aiResult = await extractTagsWithGemini(text);

      // 3. Upload to Drive
      const driveFile = await uploadFileToDrive(req.file.path, fileName);

      // 4. Save metadata to Firestore
      const metadata = {
        fileName,
        driveFileId: driveFile.id || "",
        aiTags: aiResult,
        uploadedAt: new Date().toISOString(),
        originalName: fileName,
        size: req.file.size,
        mimetype: req.file.mimetype,
      };
      await saveDocumentMetadata(driveFile.id || "", metadata);

      // 5. Clean up temp file
      if (req.file && typeof req.file.path === "string") {
        fs.unlinkSync(req.file.path);
      }

      res.json({ success: true, fileId: driveFile.id, aiTags: aiResult });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);

router.get("/list", async (req: Request, res: Response) => {
  try {
    const { q, tag, status, fromDate, toDate } = req.query;
    const docs = await getAllDocumentsMetadata({
      q: q as string ?? "",
      tag: tag as string ?? "",
      status: status as string ?? "",
      fromDate: fromDate as string ?? "",
      toDate: toDate as string ?? "",
    });
    res.json({ success: true, documents: docs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    await saveDocumentMetadata(id, update);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/move/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newCategory, newDriveFolderId, driveFileId } = req.body;
    // Update Firestore metadata
    await saveDocumentMetadata(id, {
      category: newCategory,
      driveFolderId: newDriveFolderId,
    });
    // Move file in Google Drive if folder specified
    if (driveFileId && newDriveFolderId) {
      await moveFileToDriveFolder(driveFileId, newDriveFolderId);
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create-folder", async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const drive = google.drive({ version: "v3", auth });
    const fileMetadata: any = {
      name,
      mimeType: "application/vnd.google-apps.folder",
    };
    if (parentId) fileMetadata.parents = [parentId];
    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
    });
    res.json({ success: true, folderId: folder.data.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/:id/version",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const filePath = req.file.path;
      const fileName = req.file.originalname || "untitled";
      // Upload new version to Drive
      const driveFile = await uploadFileToDrive(filePath, fileName);
      // Update Firestore: add to versions array
      const docMeta = await getDocumentMetadata(id);
      const newVersion = {
        driveFileId: driveFile.id,
        version: ((docMeta as any)?.versions?.length || 0) + 1,
        uploadedAt: new Date().toISOString(),
        uploader: "TODO", // Replace with actual user info if available
        fileName,
      };
      const updatedVersions = [
        ...((docMeta as any)?.versions || []),
        newVersion,
      ];
      await saveDocumentMetadata(id, { versions: updatedVersions });
      // Optionally update current file info
      await saveDocumentMetadata(id, { driveFileId: driveFile.id, fileName });
      fs.unlinkSync(filePath);
      res.json({ success: true, version: newVersion });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);

router.get("/:id/versions", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const docMeta = await getDocumentMetadata(id);
    res.json({ success: true, versions: (docMeta as any)?.versions || [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/restore", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { driveFileId, fileName } = req.body;
    // Update Firestore to set this version as current
    await saveDocumentMetadata(id, { driveFileId, fileName });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
