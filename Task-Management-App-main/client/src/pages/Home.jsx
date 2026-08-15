import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskApi';
import './Home.css';

function Home() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            setConnectionError(null);
            console.log('🔄 Loading tasks...');
            const response = await getTasks();
            console.log('✅ Tasks loaded:', response.data);
            setTasks(response.data);
        } catch (error) {
            console.error('❌ Error loading tasks:', error);
            
            if (error.isNetworkError || error.code === 'ECONNABORTED') {
                setConnectionError({
                    message: error.userMessage || 'Cannot connect to server',
                    isNetwork: true
                });
                toast.error('🔌 Cannot connect to server. Please check if backend is running.');
            } else {
                setConnectionError({
                    message: error.userMessage || 'Failed to load tasks',
                    isNetwork: false
                });
                toast.error(error.userMessage || 'Failed to load tasks');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            setSubmitting(true);
            const response = await createTask(taskData);
            setTasks([response.data, ...tasks]);
            toast.success('Task created successfully! 🎉');
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error(error.userMessage || 'Failed to create task');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateTask = async (id, updatedData) => {
        try {
            const response = await updateTask(id, updatedData);
            setTasks(tasks.map(task => 
                task._id === id ? response.data : task
            ));
            toast.success('Task updated successfully! ✅');
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error(error.userMessage || 'Failed to update task');
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        
        try {
            await deleteTask(id);
            setTasks(tasks.filter(task => task._id !== id));
            toast.success('Task deleted successfully! 🗑️');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error(error.userMessage || 'Failed to delete task');
        }
    };

    // ✅ Show connection error with retry button
    if (connectionError) {
        return (
            <div className="home-container">
                <div className="error-container">
                    <div className="error-icon">🔌</div>
                    <h2>Connection Error</h2>
                    <p>{connectionError.message}</p>
                    <p className="error-hint">
                        Make sure the backend server is running on port 5001
                    </p>
                    <div className="error-actions">
                        <button onClick={loadTasks} className="retry-btn">
                            🔄 Retry Connection
                        </button>
                        <button 
                            onClick={() => window.open('http://localhost:5001/api/health', '_blank')}
                            className="check-btn"
                        >
                            Check Backend
                        </button>
                    </div>
                    <div className="error-commands">
                        <p>Run this in terminal:</p>
                        <code>cd server && npm run dev</code>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="home-container">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
            <div className="home-header">
                <h1>📝 Task Manager</h1>
                <p className="subtitle">Stay organized and productive</p>
                <div className="stats">
                    <div className="stat-item">
                        <span className="stat-number">{tasks.length}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{tasks.filter(t => !t.completed).length}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{tasks.filter(t => t.completed).length}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                </div>
            </div>

            <TaskForm onAddTask={handleAddTask} isLoading={submitting} />
            <TaskList 
                tasks={tasks} 
                onUpdate={handleUpdateTask} 
                onDelete={handleDeleteTask} 
            />
        </div>
    );
}

export default Home;