import React, { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './TaskItem.css';


function TaskItem({ task, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || '');

    const handleUpdate = async () => {
        if (!editTitle.trim()) {
            alert('Title cannot be empty');
            return;
        }
        await onUpdate(task._id, {
            ...task,
            title: editTitle.trim(),
            description: editDescription.trim()
        });
        setIsEditing(false);
    };

    const handleToggleComplete = async () => {
        await onUpdate(task._id, {
            ...task,
            completed: !task.completed
        });
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await onDelete(task._id);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            {isEditing ? (
                <div className="edit-mode">
                    <div className="edit-fields">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="edit-input"
                            placeholder="Task title"
                        />
                        <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="edit-input"
                            placeholder="Description"
                        />
                    </div>
                    <div className="edit-actions">
                        <button onClick={handleUpdate} className="save-btn">
                            <FaCheck /> Save
                        </button>
                        <button onClick={() => setIsEditing(false)} className="cancel-btn">
                            <FaTimes /> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="view-mode">
                    <div className="task-content">
                        <div className="task-info">
                            <div className="task-header">
                                <h3 className="task-title">{task.title}</h3>
                                <span className="task-date">{formatDate(task.createdAt)}</span>
                            </div>
                            {task.description && (
                                <p className="task-description">{task.description}</p>
                            )}
                            <div className="task-status">
                                <span className={`status-badge ${task.completed ? 'completed-badge' : 'pending-badge'}`}>
                                    {task.completed ? '✅ Completed' : '⏳ Pending'}
                                </span>
                            </div>
                        </div>
                        <div className="task-actions">
                            <button
                                onClick={handleToggleComplete}
                                className={`action-btn complete-btn ${task.completed ? 'undo-btn' : ''}`}
                                title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                            >
                                <FaCheck />
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="action-btn edit-btn"
                                title="Edit task"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="action-btn delete-btn"
                                title="Delete task"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ✅ DEFAULT EXPORT - THIS IS IMPORTANT
export default TaskItem;