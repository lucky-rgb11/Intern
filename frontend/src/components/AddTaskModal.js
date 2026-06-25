import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

const AddTaskModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title required'); return; }
    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate || null
      };
      const res = await tasksAPI.create(payload);
      onAdd(res.data.task);
      toast.success('Task added');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New task</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="field-group">
            <label htmlFor="task-title">Title <span className="required">*</span></label>
            <input
              id="task-title"
              name="title"
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              autoFocus
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="task-desc">Notes</label>
            <textarea
              id="task-desc"
              name="description"
              placeholder="Add more details..."
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="field-row">
            <div className="field-group flex-1">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="field-group flex-1">
              <label htmlFor="task-due">Due date</label>
              <input
                id="task-due"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : <><Plus size={16} /> Add task</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
