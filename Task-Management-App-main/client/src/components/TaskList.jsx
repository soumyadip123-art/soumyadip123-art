import React from 'react';
import TaskItem from './TaskItem';  
import './TaskList.css';

function TaskList({ tasks, onUpdate, onDelete }) {
    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No tasks yet!</h3>
                <p>Add your first task using the form above.</p>
            </div>
        );
    }

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    return (
        <div className="task-list">
            {pendingTasks.length > 0 && (
                <div className="task-section">
                    <h3 className="section-title">📋 Pending Tasks ({pendingTasks.length})</h3>
                    {pendingTasks.map(task => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}

            {completedTasks.length > 0 && (
                <div className="task-section">
                    <h3 className="section-title">✅ Completed Tasks ({completedTasks.length})</h3>
                    {completedTasks.map(task => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}


export default TaskList;