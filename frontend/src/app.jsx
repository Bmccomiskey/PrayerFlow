import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

const API_URL = 'http://localhost:8000';

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchTodos(userData.id);
    }
  }, []);

  const fetchTodos = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/todos/${userId}`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos');
    }
  };

  const handleAuth = async () => {
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = JSON.stringify(
        isLogin 
          ? { email: formData.email, password: formData.password }
          : formData
      );
      
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      });

      if (!res.ok) {
        const error = await res.json();
        // Handle validation errors
        if (error.detail && Array.isArray(error.detail)) {
          const errorMsg = error.detail.map(e => e.msg).join(', ');
          throw new Error(errorMsg);
        }
        throw new Error(error.detail || 'An error occurred');
      }

      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      fetchTodos(userData.id);
      setFormData({ username: '', email: '', password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setTodos([]);
    localStorage.removeItem('user');
  };

  const addTodo = async () => {
    if (!newTodo.title.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/todos/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
      const todo = await res.json();
      setTodos([...todos, todo]);
      setNewTodo({ title: '', description: '' });
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const res = await fetch(`${API_URL}/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, completed: !todo.completed })
      });
      const updated = await res.json();
      setTodos(todos.map(t => t.id === todo.id ? updated : t));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password (6-72 characters)"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAuth}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </div>

          <p className="mt-4 text-center text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">PrayerFlow</h1>
              <p className="text-gray-600">Welcome, {user.username}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Prayer request title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Prayer Request
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No prayer requests yet. Add one above!
            </div>
          ) : (
            todos.map(todo => (
              <div
                key={todo.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-start gap-4 hover:shadow-lg transition"
              >
                <button
                  onClick={() => toggleTodo(todo)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                    todo.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {todo.completed && <Check size={16} className="text-white" />}
                </button>
                
                <div className="flex-1">
                  <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                      {todo.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 text-red-500 hover:bg-red-50 p-2 rounded transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;