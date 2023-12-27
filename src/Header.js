import React from 'react';
import { TextField, Typography, Box } from '@mui/material';

function Header({ npmUsername, setNpmUsername }) {
  const handleNpmUserChange = (event) => {
    setNpmUsername(event.target.value);
  };

  return (
    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#007BFF' }}>
        Welcome to NPMix
      </Typography>
      <Typography variant="body1" gutterBottom style={{ color: '#777' }}>
        Discover your NPM libraries effortlessly.
      </Typography>
      <TextField
        label="Enter NPM Username or Organization"
        variant="outlined"
        fullWidth
        value={npmUsername}
        onChange={handleNpmUserChange}
        style={{ marginTop: '20px' }}
      />
    </Box>
  );
}

export default Header;
