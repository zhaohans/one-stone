import express from 'express';
import { 
  getAllTrainingRecords, 
  createTrainingRecord, 
  updateTrainingRecord, 
  deleteTrainingRecord, 
  uploadProof, 
  exportTrainingCSV 
} from '../services/compliance-training.service';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// List all training records
router.get('/', getAllTrainingRecords);

// Add a new training record
router.post('/', createTrainingRecord);

// Edit a training record
router.put('/:id', updateTrainingRecord);

// Delete a training record
router.delete('/:id', deleteTrainingRecord);

// Upload proof file
router.post('/:id/proof', upload.single('file'), uploadProof);

// Export CSV
router.get('/export/csv', exportTrainingCSV);

export default router; 