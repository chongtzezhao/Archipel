import React from 'react';
import { Link } from "react-router-dom";

const Nav = (props: { username: string, setUsername: (username: string) => void }) => {
  const logout = async () => {
    await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    props.setUsername('');
  }

  let menu;
  console.log(props.username + " is logged in");

  if (props.username === '' || props.username === undefined) {
    menu = (
      <ul className="navbar-nav me-auto mb-2 mb-md-0">
        <li className="nav-item active">
          <Link to="/login" className="nav-link">Login</Link>
        </li>
        <li className="nav-item active">
          <Link to="/register" className="nav-link">Register</Link>
        </li>
      </ul>
    )
  } else {
    menu = (
      <ul className="navbar-nav me-auto mb-2 mb-md-0">
        <li className="nav-item active">
          <Link to="/login" className="nav-link" onClick={logout}>Logout</Link>
        </li>
        <li className="nav-item active">
          <Link to="/newpost" className="nav-link" >New Post</Link>
        </li>
        <li className="nav-item active">
          <Link to="/werw/werrw" className="nav-link" >New Post</Link>
        </li>
      </ul>
    )
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark mb-4">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">Home</Link>

        <div>
          {menu}
        </div>
      </div>
    </nav>
  );
};

export default Nav;