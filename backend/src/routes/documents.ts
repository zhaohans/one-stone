import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
// import { uploadFileToDrive, moveFileToDriveFolder } from "../services/drive";
// import { extractTagsWithGemini } from "../services/gemini";
// import { saveDocumentMetadata, getAllDocumentsMetadata, getDocumentMetadata } from "../services/firestore";
// import { google } from "googleapis";
// @ts-ignore
const { parseWithDocling } = require('../services/doclingClient');
const { saveDocumentMetadata: supabaseSaveDocumentMetadata, getAllDocumentsMetadata: supabaseGetAllDocumentsMetadata } = require('../services/supabaseClient');

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
      let doclingResult = null;
      try {
        doclingResult = await parseWithDocling(req.file.path);
      } catch (err) {
        if (err instanceof Error) {
          console.error('Docling error:', err.message);
        } else {
          console.error('Docling error:', String(err));
        }
      }
      const metadata = {
        file_name: fileName,
        uploaded_at: new Date().toISOString(),
        size: req.file.size,
        mimetype: req.file.mimetype,
        category: req.body.category || null,
        tags: req.body.tags ? JSON.parse(req.body.tags) : null,
        docling: doclingResult,
        document_type: req.file.mimetype && req.file.mimetype.startsWith('application/pdf') ? 'PDF' : req.file.mimetype && req.file.mimetype.includes('word') ? 'DOCX' : 'UNKNOWN',
      };
      await supabaseSaveDocumentMetadata(metadata);
      res.json({ success: true, fileName, docling: doclingResult });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message || String(error) });
    }
  }
);

router.get("/list", async (req: Request, res: Response) => {
  try {
    const docs = await supabaseGetAllDocumentsMetadata();
    res.json({ success: true, documents: docs });
  } catch (error: any) {
    console.error("Error in /documents/list:", error, error?.stack);
    res.status(500).json({ error: error.message || String(error) });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    // await saveDocumentMetadata(id, update);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// router.post("/move/:id", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { newCategory, newDriveFolderId, driveFileId } = req.body;
//     // Update Firestore metadata
//     await saveDocumentMetadata(id, {
//       category: newCategory,
//       driveFolderId: newDriveFolderId,
//     });
//     // Move file in Google Drive if folder specified
//     if (driveFileId && newDriveFolderId) {
//       await moveFileToDriveFolder(driveFileId, newDriveFolderId);
//     }
//     res.json({ success: true });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post("/create-folder", async (req: Request, res: Response) => {
//   try {
//     const { name, parentId } = req.body;
//     const auth = await google.auth.getClient({
//       scopes: ["https://www.googleapis.com/auth/drive"],
//     });
//     const drive = google.drive({ version: "v3", auth });
//     const fileMetadata: any = {
//       name,
//       mimeType: "application/vnd.google-apps.folder",
//     };
//     if (parentId) fileMetadata.parents = [parentId];
//     const folder = await drive.files.create({
//       requestBody: fileMetadata,
//       fields: "id",
//     });
//     res.json({ success: true, folderId: folder.data.id });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });

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
      // const driveFile = await uploadFileToDrive(filePath, fileName);
      // Update Firestore: add to versions array
      // const docMeta = await getDocumentMetadata(id);
      const newVersion = {
        // driveFileId: driveFile.id,
        version: 1,
        uploadedAt: new Date().toISOString(),
        uploader: "TODO", // Replace with actual user info if available
        fileName,
      };
      // const updatedVersions = [
      //   ...((docMeta as any)?.versions || []),
      //   newVersion,
      // ];
      // await saveDocumentMetadata(id, { versions: updatedVersions });
      // Optionally update current file info
      // await saveDocumentMetadata(id, { driveFileId: driveFile.id, fileName });
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
    // const docMeta = await getDocumentMetadata(id);
    res.json({ success: true, versions: [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/restore", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { driveFileId, fileName } = req.body;
    // Update Firestore to set this version as current
    // await saveDocumentMetadata(id, { driveFileId, fileName });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    // const docs = await getAllDocumentsMetadata();
    res.json({ success: true, documents: [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/test", (req, res) => {
  res.json({ success: true, message: "Backend is alive!" });
});

export default router;
