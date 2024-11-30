import React, { useState, useEffect } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';
import '../../src/App.css';



function Home() {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState('');
    const [editId, setEditId] = useState(null); // State to track the task being edited
    const [editTask, setEditTask] = useState(''); // State for the new task description
    const [loading, setLoading] = useState(true);


    // Fetch todos from the backend
    const fetchTodos = () => {
        setLoading(true);
        axios.get('https://todo-backend-1-esed.onrender.com/get')
            .then(result => {
                setLoading(false);
                if (Array.isArray(result.data)) {
                    setTodos(result.data);
                } else {
                    console.error('API response is not an array:', result.data);
                    setError('Unexpected API response format.');
                }
            })
            .catch(err => {
                setLoading(false);
                console.error('API Error:', err);
                setError('Failed to fetch todos.');
            });
    };
    

    // Fetch todos when the component mounts
    useEffect(() => {
        fetchTodos();
    }, []);


    

    const handleToggleDone = (id) => {
        axios.put(`https://todo-backend-1-esed.onrender.com/update/${id}`)
            .then(() => {
                setTodos(prevTodos =>
                    prevTodos.map(todo =>
                        todo._id === id ? { ...todo, done: !todo.done } : todo
                    )
                );
            })
            .catch(err => console.error('Error updating todo:', err));
    };

    const handleDelete = (id) => {
        axios.delete(`https://todo-backend-1-esed.onrender.com/delete/${id}`)
            .then(() => {
                setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
            })
            .catch(err => console.error('Error deleting todo:', err));
    };

    const handleEdit = (id, task) => {
        setEditId(id);
        setEditTask(task); // Prefill the input with the current task
    };

    const handleUpdate = (id) => {
        if (!editTask.trim()) {
            alert('Task cannot be empty');
            return;
        }
        axios.put(`https://todo-backend-1-esed.onrender.com/edit/${id}`, { task: editTask })
        .then(() => {
            setTodos(prevTodos =>
                prevTodos.map(todo =>
                    todo._id === id ? { ...todo, task: editTask } : todo
                )
            );
            setEditId(null); // Clear edit mode
            setEditTask('');
        })
        .catch(err => console.error('Error updating todo:', err));
    };    
    
    return (
        <div className='home'>
            <h2>Todo List</h2>
            {/* <Create fetchTodos={fetchTodos} /> Pass fetchTodos to Create */}
            <Create fetchTodos={fetchTodos} />

            {error && <div className='error'>{error}</div>}
            {
                todos.length === 0 && !error ? (
                    <div><h2>No Record</h2></div>
                ) : (
                    todos.map(todo => (
                        <div key={todo._id} className='task'>
                            {editId === todo._id ? (
                                // Render input field when editing
                                <div className='edit-task'>               
                                  <input
                                        type="text"
                                        value={editTask}
                                        onChange={(e) => setEditTask(e.target.value)}
                                    />                                                        
                                    <button onClick={() => handleUpdate(todo._id)}>Update</button>
                                    <button onClick={() => setEditId(null)}>Cancel</button>
                                    
                                </div>
                            ) : (
                                <div className='checkbox'>
                                    <div onClick={() => handleToggleDone(todo._id)}>
                                        {todo.done ? (
                                            <BsFillCheckCircleFill className="icon" />
                                        ) : (
                                            <BsCircleFill className="icon" />
                                        )}
                                        <span className={todo.done ? 'line_through' : 'break'}>{todo.task}</span>
                                    </div>
                                    <div>
                                        <span className='icons'>
                                            <BsPencil className="icon" onClick={() => handleEdit(todo._id, todo.task)} />
                                            <BsFillTrashFill className="icon" onClick={() => handleDelete(todo._id)} />
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )
            }
        </div>
    );
}

export default Home;
