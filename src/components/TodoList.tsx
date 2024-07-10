import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Header from './Header';

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTodoText, setEditTodoText] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [todos, filter]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get<Todo[]>('http://localhost:5000/todo/');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (task: string) => {
    try {
      const response = await axios.post<Todo>('http://localhost:5000/todo/', { task, completed: false });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/todo/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id: number, updatedTodo: Partial<Todo>) => {
    try {
      const response = await axios.put<Todo>(`http://localhost:5000/todo/${id}`, updatedTodo);
      const updatedTodos = todos.map(todo => (todo.id === id ? response.data : todo));
      setTodos(updatedTodos);
      cancelEdit(); // Hapus state editing setelah berhasil update
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodo.trim() === '') {
      setError('Task cannot be empty');
      window.alert('Task Cannot be empty');
      return;
    }
    addTodo(newTodo);
    setError('');
  };

  const applyFilter = () => {
    switch (filter) {
      case 'completed':
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      case 'incomplete':
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case 'all':
      default:
        setFilteredTodos(todos);
        break;
    }
  };

  const startEdit = (id: number, task: string) => {
    setEditTodoId(id);
    setEditTodoText(task);
  };

  const cancelEdit = () => {
    setEditTodoId(null);
    setEditTodoText('');
  };

  const handleUpdateTodo = (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
    if (editTodoText.trim() === '') {
      setError('Task cannot be empty');
      window.alert('Task Cannot be empty');
      return;
    }
    updateTodo(id, { task: editTodoText });
    setError('');
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Todo List</h2>
      <form onSubmit={handleAddTodo} className="mb-4 flex">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-l border-gray-300"
          placeholder="Enter task"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r">
          Add Todo
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'incomplete' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => setFilter('incomplete')}
        >
          Incomplete
        </button>
      </div>
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id} className="flex items-center justify-between mb-2 p-2 bg-gray-100 rounded-lg">
            {editTodoId === todo.id ? (
              <form onSubmit={e => handleUpdateTodo(e, todo.id)} className="flex items-center flex-1">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 rounded-l border-gray-300"
                  value={editTodoText}
                  onChange={e => setEditTodoText(e.target.value)}
                />
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-r">
                  Update
                </button>
                <button
                  type="button"
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>{todo.task}</span>
                <div>
                  <button
                    className={`px-3 py-1 rounded ${todo.completed ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}
                    onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
                  >
                    {todo.completed ? 'Completed' : 'Incomplete'}
                  </button>
                  <button
                    className="ml-2 px-3 py-1 rounded bg-yellow-500 text-white"
                    onClick={() => startEdit(todo.id, todo.task)}
                  >
                    Edit
                  </button>
                  <button
                    className="ml-2 px-3 py-1 rounded bg-red-500 text-white"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
