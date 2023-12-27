import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

function Header({ onUserSubmit }) {
  const [npmUser, setNpmUser] = useState('');
  const [githubUser, setGithubUser] = useState('');

  const handleSubmit = () => {
    onUserSubmit(npmUser, githubUser);
  };

  return (
    <header>
      <h1>NPM Library Trends</h1>
      <p>Discover and explore trending NPM libraries</p>
      <div>
        <TextField label="NPM Username" value={npmUser} onChange={(e) => setNpmUser(e.target.value)} />
        <TextField label="GitHub Username" value={githubUser} onChange={(e) => setGithubUser(e.target.value)} />
        <Button onClick={handleSubmit}>Generate Profile</Button>
      </div>
    </header>
  );
}

export default Header;
