import { google } from 'googleapis';
import fs from 'fs';

const drive = google.drive('v3');

export const uploadFileToDrive = async (filePath: string, fileName: string | undefined | null, parents: string[] = []) => {
  const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/drive'] });
  const safeFileName = typeof fileName === 'string' ? fileName : 'untitled';
  const res = await drive.files.create({
    requestBody: {
      name: safeFileName,
      parents,
    },
    media: {
      body: fs.createReadStream(filePath),
    },
    auth,
  });
  return res.data;
};

export const updateDriveFileMetadata = async (fileId: string, metadata: any) => {
  const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/drive'] });
  const res = await drive.files.update({
    fileId,
    requestBody: metadata,
    auth,
  });
  return res.data;
};

export const moveFileToDriveFolder = async (fileId: string, newFolderId: string) => {
  const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/drive'] });
  // Get the file's current parents
  const file = await drive.files.get({ fileId, fields: 'parents', auth });
  const previousParents = file.data.parents ? file.data.parents.join(',') : '';
  // Move the file to the new folder
  const res = await drive.files.update({
    fileId,
    addParents: newFolderId,
    removeParents: previousParents,
    auth,
  });
  return res.data;
}; 