import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Nav from "./components/Nav";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewPost from './pages/NewPost';
import SinglePost from './pages/SinglePost';

const NonExistent = () => {
  return (
    <main id="ocean">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">404</h5>
          <h6 className="card-subtitle mb-2 text-muted">Page not found</h6>
          <p className="card-text">The page you are looking for does not exist.</p>
        </div>
      </div>
    </main>
  );
};

import './App.css';

export default function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    (
      async () => {
        const response = await fetch('http://localhost:8000/api/user', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const content = await response.json();

        setUsername(content.username);
      }
    )();
  });


  return (
    <div className="app">
      <Nav username={username} setUsername={setUsername} />
      <Routes>
        <Route path="/" element={<Home username={username} />} />
        <Route path="/login" element={<Login setUsername={setUsername} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpost" element={<NewPost username={username} />} />
        <Route path="/post/:id" element={<SinglePost username={username} />} />
        <Route path="/werw/werrw" element={<NewPost username={username} />} />
        <Route path="/*" element={<NonExistent />} />
      </Routes>
    </div>

  );
}