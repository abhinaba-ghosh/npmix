import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardActionArea, Collapse, Link, IconButton } from '@mui/material';
import TrendChart from './TrendChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';
import './LibraryCard.css';

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
  const [packageInfo, setPackageInfo] = useState({ lastUpdated: '', version: '', maintainerAvatar: '' });

  useEffect(() => {
    axios
      .get(`https://api.npmjs.org/downloads/point/1970-01-01:${new Date().toISOString().split('T')[0]}/${packageName}`)
      .then((response) => setDownloadData(response.data))
      .catch((error) => console.error('Error fetching download data:', error));
  }, [packageName]);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const registryResponse = await axios.get(`https://registry.npmjs.org/${packageName}`);
        setDescription(registryResponse.data.description || 'No description available');
        setPackageInfo({
          lastUpdated: registryResponse.data.time.modified || 'N/A',
          version: registryResponse.data['dist-tags'].latest || 'N/A',
          maintainerAvatar: registryResponse.data.maintainers[0]?.avatar || '',
        });
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
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </IconButton>
          </Typography>
          <Typography variant="body2" color="textSecondary" className="downloads">
            {downloadData ? `Downloads: ${formatDownloads(downloadData.downloads)}` : 'Loading...'}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="description">
            {description}
          </Typography>
          <div className="package-info">
            <Typography variant="body2" color="textSecondary">
              Last Updated: {packageInfo.lastUpdated}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Version: {packageInfo.version}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <TrendChart packageName={packageName} />
      </Collapse>
      <div className={`expand-section ${expanded ? 'expanded' : ''}`}>
        <IconButton onClick={() => setExpanded(!expanded)} className="expand-button">
          <FontAwesomeIcon icon={faChartLine} />
        </IconButton>
        <Typography
          variant="body2"
          color="textSecondary"
          className="expand-text"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Check the Trend' : 'Expand to Check the Trend'}
        </Typography>
      </div>
    </Card>
  );
}

export default LibraryCard;
