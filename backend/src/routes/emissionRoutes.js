import express from 'express';
import {
  createEmission,
  getUserEmissions,
  updateEmission,
  deleteEmission
} from '../controllers/emissionController.js';

const router = express.Router();

// Emissions CRUD endpoints
router.post('/', createEmission);
router.get('/user/:userId', getUserEmissions);
router.put('/:id', updateEmission);
router.delete('/:id', deleteEmission);

export default router;
