import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Navbar, Nav, Form, FormControl, Button, Dropdown } from 'react-bootstrap';

const options = ["User", "Topic", "Title"];

const myNav = (props: { username: string, setUsername: (username: string) => void, setQuery: (q: string) => void, setGetMode: (m: string) => void }) => {
  const navigate = useNavigate();
  const logout = async () => {
    await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    console.log("LOGOUT CALLED");
    props.setUsername('');
  }

  const [searchText, setSearchText] = useState("");
  const [redirectWithQuery, setRedirectWithQuery] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelect = (selectedKey) => {
    setSelectedOption(options[selectedKey]);
  };

  const search = async () => {
    // redirect to home with parameters
    props.setQuery(searchText);
    props.setGetMode(selectedOption);
    setRedirectWithQuery(true);
  }

  if (redirectWithQuery) {
    setRedirectWithQuery(false);
    console.log("REDIRECTING TO : " + searchText + " " + selectedOption);
    return <Navigate to="/search" />;
  }

  let menu;

  if (props.username === '' || props.username === undefined) {
    menu = (
      <Nav className="routes ms-auto d-flex justify-content-between">
        <Nav.Link href="/register">Register</Nav.Link>
        <Nav.Link href="/login">Login</Nav.Link>
      </Nav>
    )
  } else {
    menu = (
      <Nav className="routes ms-auto d-flex justify-content-between">
        <Nav.Link onClick={() => navigate("/newpost")}>New Post</Nav.Link>
        <Nav.Link onClick={() => navigate("/myposts")}>My Posts</Nav.Link>
        <Nav.Link onClick={logout}>Logout</Nav.Link>
      </Nav>
    )
  }

  return (

    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Navbar.Brand href="/">Home</Navbar.Brand>

      <Form className="ms-auto d-flex" style={{ flex: 1 }}>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={(e) => setSearchText(e.target.value)} style={{ flex: 1 }} />
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedOption}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {options.map((option, index) => (
              <Dropdown.Item eventKey={index} key={index} href={`#/action-${index + 1}`}>
                {option}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="outline-light" onClick={search}>Search</Button>
      </Form>
     {menu}
    </Navbar>

  );
};

export default myNav;