import React from 'react';
import { TextField, Typography, Box, Link } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

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
      <Link
        href="https://github.com/abhinaba-ghosh/NPMix"  // Replace with your GitHub repo link
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <Typography variant="body1" style={{ color: '#007BFF' }}>
          <FontAwesomeIcon icon={faGithub} style={{ marginRight: '8px' }} />
          Fork and Contribute on GitHub
        </Typography>
      </Link>
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
