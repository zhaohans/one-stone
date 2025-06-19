import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { firestore } from "./firestore";
import { analyzeDocument } from "./ai.service";
import { NotificationService } from "./notification.service";

export class DriveSyncService {
  private drive;
  private folderId: string;
  private notificationService: NotificationService;

  constructor(credentials: any, folderId: string) {
    const auth = new OAuth2Client(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri,
    );
    auth.setCredentials(credentials.tokens);
    this.drive = google.drive({ version: "v3", auth });
    this.folderId = folderId;
    this.notificationService = new NotificationService();
  }

  async syncNewFiles() {
    try {
      console.log("Starting Drive sync...");
      const driveFiles = await this.listDriveFiles();
      const dbFiles = await this.getDatabaseFiles();

      const newFiles = this.findNewFiles(driveFiles, dbFiles);
      console.log(`Found ${newFiles.length} new files to process`);

      for (const file of newFiles) {
        await this.processNewFile(file);
      }

      console.log("Drive sync completed successfully");
      return { success: true, newFilesCount: newFiles.length };
    } catch (error) {
      console.error("Drive sync failed:", error);
      return { success: false, error: (error as Error).message };
    }
  }

  private async listDriveFiles() {
    const response = await this.drive.files.list({
      q: `'${this.folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, size, createdTime, modifiedTime)",
    });
    return response.data.files || [];
  }

  private async getDatabaseFiles() {
    const snapshot = await firestore.collection("documents").get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      driveFileId: doc.data().driveFileId,
    }));
  }

  private findNewFiles(driveFiles: any[], dbFiles: any[]) {
    const dbFileIds = new Set(dbFiles.map((f) => f.driveFileId));
    return driveFiles.filter((file) => !dbFileIds.has(file.id));
  }

  private async processNewFile(file: any) {
    console.log(`Processing new file: ${file.name}`);

    // 1. Download and analyze
    const analysis = await this.analyzeFile(file);

    // 2. Create database record
    const docRef = await firestore.collection("documents").add({
      driveFileId: file.id,
      fileName: file.name,
      mimeType: file.mimeType,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      aiTags: analysis.tags,
      status: "Pending Review",
      expiryDate: this.calculateDefaultExpiry(),
      complianceStatus: "missing_review",
      source: "drive_sync",
      lastModified: file.modifiedTime,
      createdTime: file.createdTime,
    });

    // 3. Notify users about the new file
    await this.notificationService.notifyNewFile(file.name, docRef.id);

    console.log(`Successfully processed file: ${file.name}`);
  }

  private async analyzeFile(file: any) {
    // Download file content for analysis
    const response = await this.drive.files.get(
      {
        fileId: file.id,
        alt: "media",
      },
      { responseType: "stream" },
    );

    // Analyze the file content
    const analysis = await analyzeDocument(response.data, file.name);
    return analysis;
  }

  private calculateDefaultExpiry() {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow.toISOString();
  }
}
