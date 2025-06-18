import { CronJob } from 'cron';
import { DriveSyncService } from '../services/drive-sync.service';
import { getGoogleCredentials } from '../config/google';

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

if (!DRIVE_FOLDER_ID) {
  throw new Error('GOOGLE_DRIVE_FOLDER_ID environment variable is required');
}

export function startSyncJob() {
  const syncJob = new CronJob('*/15 * * * *', async () => {
    try {
      console.log('Starting scheduled Drive sync...');
      const credentials = await getGoogleCredentials();
      const driveSync = new DriveSyncService(credentials, DRIVE_FOLDER_ID);
      const result = await driveSync.syncNewFiles();
      
      if (result.success) {
        console.log(`Sync completed. Processed ${result.newFilesCount} new files.`);
      } else {
        console.error('Sync failed:', result.error);
      }
    } catch (error) {
      console.error('Sync job failed:', error);
    }
  });

  syncJob.start();
  console.log('Drive sync job started. Will run every 15 minutes.');
} 