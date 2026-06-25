import React, { useState } from 'react';
import { Check, Trash2, Calendar, Flag, Edit2, X, Save } from 'lucide-react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#6b7280' },
  medium: { label: 'Medium', color: '#f59e0b' },
  high: { label: 'High', color: '#ef4444' },
};

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: task.title, description: task.description || '' });
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await tasksAPI.toggle(task._id);
      onUpdate(res.data.task);
    } catch {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(task._id);
      onDelete(task._id);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleSaveEdit = async () => {
    if (!editForm.title.trim()) { toast.error('Title required'); return; }
    setLoading(true);
    try {
      const res = await tasksAPI.update(task._id, editForm);
      onUpdate(res.data.task);
      setEditing(false);
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div className={`task-card ${task.completed ? 'task-completed' : ''} ${isOverdue ? 'task-overdue' : ''}`}>
      <div className="task-check-area">
        <button
          className={`check-btn ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          disabled={loading}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && <Check size={14} />}
        </button>
      </div>

      <div className="task-body">
        {editing ? (
          <div className="edit-form">
            <input
              className="edit-title-input"
              value={editForm.title}
              onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
              autoFocus
            />
            <textarea
              className="edit-desc-input"
              value={editForm.description}
              onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Add a note..."
              rows={2}
            />
          </div>
        ) : (
          <>
            <span className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
              {task.title}
            </span>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </>
        )}

        <div className="task-meta">
          <span className="task-priority" style={{ color: p.color }}>
            <Flag size={11} />
            {p.label}
          </span>
          {task.dueDate && (
            <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
              <Calendar size={11} />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {isOverdue && ' · Overdue'}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        {editing ? (
          <>
            <button className="action-btn save-btn" onClick={handleSaveEdit} disabled={loading}>
              <Save size={14} />
            </button>
            <button className="action-btn cancel-btn" onClick={() => setEditing(false)}>
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <button className="action-btn edit-btn" onClick={() => {
              setEditForm({ title: task.title, description: task.description || '' });
              setEditing(true);
            }}>
              <Edit2 size={14} />
            </button>
            <button className="action-btn delete-btn" onClick={handleDelete}>
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
