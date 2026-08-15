import express from 'express';
import * as taskController from '../controllers/taskController.js';

const router = express.Router();

// Get all tasks
router.get('/', taskController.getTasks);

// Get single task
router.get('/:id', taskController.getTask);

// Create task
router.post('/', taskController.createTask);

// Update task
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

export default router;