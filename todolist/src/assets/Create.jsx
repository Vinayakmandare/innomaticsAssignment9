import React, { useState } from 'react';
import axios from 'axios'
function Create({ fetchTodos }) {
  const [task, setTask] = useState('');

  const handleAdd = () => {
      axios.post('https://todo-backend-1-esed.onrender.com/add', { task })
          .then(() => fetchTodos())
          .catch(err => console.error(err));
  };

  return (
      <form className='create_form'>
          <input
              type="text"
              placeholder='Enter Task'
              value={task}
              onChange={(e) => setTask(e.target.value)}
          />
          <button type='button' onClick={handleAdd}>Add</button>
      </form>
  );
}

export default Create;
