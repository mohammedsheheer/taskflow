/**
 * CI-007: routes/taskRoutes.js
 * Baseline: System Baseline v1.0.0
 */

import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect); // All task routes require authentication

router.get('/',     getTasks);
router.post('/',    createTask);
router.put('/:id',  updateTask);
router.delete('/:id', deleteTask);

export default router;
