import React, { SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });
    console.log("REGISTERED USER: " + JSON.stringify(await response.json()));

    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="form-signin">
      <form onSubmit={submit}>
        <h1 className="h3 mb-3 fw-normal">Please register</h1>

        <input className="form-control" placeholder="Username" required
          onChange={e => setUsername(e.target.value)}
        />

        <input type="email" className="form-control" placeholder="Email address" required
          onChange={e => setEmail(e.target.value)}
        />

        <input type="password" className="form-control" placeholder="Password" required
          onChange={e => setPassword(e.target.value)}
        />

        <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;