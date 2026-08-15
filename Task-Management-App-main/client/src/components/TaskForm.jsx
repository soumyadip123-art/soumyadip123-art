import React, { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onAddTask, isLoading }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('Please enter a task title');
            return;
        }

        await onAddTask({ title: title.trim(), description: description.trim() });
        setTitle('');
        setDescription('');
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="What do you need to do?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                    className="form-input"
                />
                <input
                    type="text"
                    placeholder="Add a description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    className="form-input"
                />
            </div>
            <button type="submit" disabled={isLoading} className="add-btn">
                {isLoading ? 'Adding...' : '➕ Add Task'}
            </button>
        </form>
    );
}

// ✅ DEFAULT EXPORT
export default TaskForm;