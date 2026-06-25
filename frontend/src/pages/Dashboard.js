import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import toast from 'react-hot-toast';
import { Plus, LogOut, CheckSquare, Search, SlidersHorizontal } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'pending') params.completed = false;
      if (filter === 'completed') params.completed = true;
      if (priority !== 'all') params.priority = priority;
      const res = await tasksAPI.getAll(params);
      setTasks(res.data.tasks);
      setStats(res.data.stats);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filter, priority]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleAdd = (task) => setTasks(t => [task, ...t]);
  const handleUpdate = (updated) => setTasks(t => t.map(tk => tk._id === updated._id ? updated : tk));
  const handleDelete = (id) => setTasks(t => t.filter(tk => tk._id !== id));

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  );

  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <CheckSquare size={24} className="logo-icon" />
          <span className="logo-text">TaskFlow</span>
        </div>

        <div className="user-card">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { key: 'all', label: 'All tasks', count: stats.total },
            { key: 'pending', label: 'Pending', count: stats.pending },
            { key: 'completed', label: 'Completed', count: stats.completed },
          ].map(item => (
            <button
              key={item.key}
              className={`nav-item ${filter === item.key ? 'active' : ''}`}
              onClick={() => setFilter(item.key)}
            >
              <span>{item.label}</span>
              <span className="nav-count">{item.count}</span>
            </button>
          ))}
        </nav>

        <div className="progress-section">
          <div className="progress-label">
            <span>Today's progress</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="progress-sub">{stats.completed} of {stats.total} tasks done</p>
        </div>

        <button className="logout-btn" onClick={() => { logout(); toast('Signed out'); }}>
          <LogOut size={16} />
          Sign out
        </button>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">
              {filter === 'all' ? 'All tasks' : filter === 'pending' ? 'Pending' : 'Completed'}
            </h1>
            <p className="dash-subtitle">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New task
          </button>
        </header>

        {/* Controls */}
        <div className="controls-bar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>×</button>
            )}
          </div>

          <div className="filter-group">
            <SlidersHorizontal size={15} />
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Task list */}
        <div className="task-list">
          {loading ? (
            <div className="state-center">
              <div className="spinner" />
              <p>Loading tasks...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="state-center empty">
              <div className="empty-icon">
                {search ? <Search size={40} /> : <CheckSquare size={40} />}
              </div>
              <h3>{search ? 'No results' : filter === 'completed' ? 'No completed tasks yet' : 'No tasks yet'}</h3>
              <p>{search ? `No tasks match "${search}"` : filter === 'completed' ? 'Complete a task to see it here' : 'Add a task to get started'}</p>
              {!search && filter !== 'completed' && (
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                  <Plus size={16} /> Add your first task
                </button>
              )}
            </div>
          ) : (
            filtered.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default Dashboard;
