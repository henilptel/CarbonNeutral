import express from 'express';
import {
  createSink,
  getUserSinks,
  updateSink,
  deleteSink
} from '../controllers/sinkController.js';

const router = express.Router();

// Create sink project
router.post('/', createSink);

// Get user's sink projects
router.get('/user/:userId', getUserSinks);

// Update sink project
router.put('/:id', updateSink);

// Delete sink project
router.delete('/:id', deleteSink);

export default router;
