const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

async function uploadFileToDrive(localFilePath, driveFolderId) {
  const drive = google.drive({ version: 'v3', auth: await auth.getClient() });
  const fileMetadata = {
    name: path.basename(localFilePath),
    parents: [driveFolderId],
  };
  const media = {
    mimeType: 'application/pdf', // Change as needed
    body: fs.createReadStream(localFilePath),
  };
  const res = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, webViewLink, webContentLink',
  });
  console.log('File uploaded:', res.data);
  return res.data;
}

// Usage example:
(async () => {
  try {
    await uploadFileToDrive('./test.pdf', '1s096UQDxEwZJVdPE6kgSCxtZYusDUdfx');
  } catch (err) {
    console.error('Upload failed:', err);
  }
})(); 