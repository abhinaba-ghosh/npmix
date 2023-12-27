import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardActionArea, Collapse, Link, IconButton } from '@mui/material';
import TrendChart from './TrendChart';
import LaunchIcon from '@mui/icons-material/Launch'; // Import the LaunchIcon
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import the ExpandMoreIcon
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // Import the ExpandLessIcon
import './LibraryCard.css'; // Import a custom CSS file for styling

function formatDownloads(count) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

function LibraryCard({ packageName, expanded, setExpanded }) {
  const [downloadData, setDownloadData] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios
      .get(`https://api.npmjs.org/downloads/point/1970-01-01:${new Date().toISOString().split('T')[0]}/${packageName}`)
      .then(response => setDownloadData(response.data))
      .catch(error => console.error('Error fetching download data:', error));
  }, [packageName]);

  useEffect(() => {
    // Fetch library description from npm registry
    const fetchDescription = async () => {
      try {
        const registryResponse = await axios.get(`https://registry.npmjs.org/${packageName}`);
        setDescription(registryResponse.data.description || 'No description available');
      } catch (error) {
        console.error('Error fetching library description:', error);
      }
    };

    fetchDescription();
  }, [packageName]);

  return (
    <Card className={`library-card ${expanded ? 'expanded' : ''}`}>
      <CardActionArea onClick={() => setExpanded(!expanded)}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" className="package-name">
            <Link href={`https://www.npmjs.com/package/${packageName}`} target="_blank" rel="noopener noreferrer">
              {packageName}
            </Link>
            <IconButton className="launch-button" aria-label="Launch">
              <LaunchIcon fontSize="inherit" />
            </IconButton>
          </Typography>
          <Typography variant="body2" color="textSecondary" className="downloads">
            {downloadData ? `Downloads: ${formatDownloads(downloadData.downloads)}` : 'Loading...'}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="description">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <TrendChart packageName={packageName} />
      </Collapse>
      <div className={`expand-section ${expanded ? 'expanded' : ''}`}>
        <IconButton
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Collapse' : 'Expand'}
          className="expand-button"
        >
          {expanded ? <ExpandLessIcon fontSize="large" /> : <ExpandMoreIcon fontSize="large" />}
        </IconButton>
        <Typography variant="body2" color="textSecondary" className="expand-text">
          {expanded ? 'Click to Collapse' : 'Click to Expand'}
        </Typography>
      </div>
    </Card>
  );
}

export default LibraryCard;
