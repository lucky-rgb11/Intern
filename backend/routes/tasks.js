const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// All task routes require authentication
router.use(protect);

// @route  GET /api/tasks
// @desc   Get all tasks for logged-in user
// @access Private
router.get('/', async (req, res) => {
  try {
    const { completed, priority, sort = '-createdAt', page = 1, limit = 50 } = req.query;
    
    const filter = { user: req.user._id };
    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Task.countDocuments(filter);
    const completedCount = await Task.countDocuments({ user: req.user._id, completed: true });
    const pendingCount = await Task.countDocuments({ user: req.user._id, completed: false });

    res.json({
      tasks,
      stats: { total, completed: completedCount, pending: pendingCount },
      pagination: { page: Number(page), limit: Number(limit), total }
    });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// @route  POST /api/tasks
// @desc   Create a new task
// @access Private
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1–200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null
    });

    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// @route  GET /api/tasks/:id
// @desc   Get a single task
// @access Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid task ID' });
    res.status(500).json({ message: 'Failed to fetch task' });
  }
});

// @route  PUT /api/tasks/:id
// @desc   Update a task
// @access Private
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1–200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('completed').optional().isBoolean().withMessage('Completed must be boolean'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { title, description, priority, completed, dueDate } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.json({ message: 'Task updated', task });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid task ID' });
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// @route  DELETE /api/tasks/:id
// @desc   Delete a task
// @access Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted', taskId: req.params.id });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid task ID' });
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

// @route  PATCH /api/tasks/:id/toggle
// @desc   Toggle task completion
// @access Private
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.completed = !task.completed;
    await task.save();

    res.json({ message: `Task marked as ${task.completed ? 'complete' : 'incomplete'}`, task });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid task ID' });
    res.status(500).json({ message: 'Failed to toggle task' });
  }
});

module.exports = router;
