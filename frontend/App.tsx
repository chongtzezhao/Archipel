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
  const [searchQuery, setQuery] = useState('');
  const [getMode, setGetMode] = useState('');

  useEffect(() => {
    (
      async () => {
        const response = await fetch('http://localhost:8000/api/user', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const content = await response.json();

        setUsername(content.username);
        console.log("USER: " + JSON.stringify(content.username));
        console.log("USER: " + JSON.stringify(username));
      }
    )();
  }, [username, searchQuery, getMode]);


  return (
    <main id="ocean">
      <Nav username={username} setUsername={setUsername} setQuery={setQuery} setGetMode={setGetMode} />
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} getMode="all" username={username}/>} />
        <Route path="/search" element={<Home searchQuery={searchQuery} getMode={getMode} username={username}/>} />
        <Route path="/login" element={<Login setUsername={setUsername} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpost" element={<NewPost username={username} isNewPost={true}/>} />
        <Route path="/post/:id" element={<SinglePost username={username} />} />
        <Route path="/editpost/:id" element={<NewPost username={username} isNewPost={false} />} />
        <Route path="/myposts" element={<Home searchQuery={username} getMode="user" username={username}/>} />
        <Route path="/*" element={<NonExistent />} />
      </Routes>
    </main>
  );
}