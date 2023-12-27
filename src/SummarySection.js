import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import './SummarySection.css';

function SummarySection({ githubUsername }) {
  const [githubData, setGithubData] = useState({});
  const [libraryCount, setLibraryCount] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (githubUsername) { // Check if githubUsername is not empty
      axios
        .get(`https://api.github.com/users/${githubUsername}`)
        .then((response) => {
          setGithubData(response.data);
        })
        .catch((error) => {
          setError(error);
          console.error('Error fetching GitHub data:', error);
        });

    axios
      .get(`https://api.github.com/users/${githubUsername}`)
      .then((response) => {
        setGithubData(response.data);
      })
      .catch((error) => {
        setError(error);
        console.error('Error fetching GitHub data:', error);
      });

    axios
      .get('https://registry.npmjs.org/-/v1/search', {
        params: { text: `maintainer:${githubUsername}` }
      })
      .then(async (response) => {
        const packages = response.data.objects.map((obj) => obj.package.name);

        const downloadCounts = await Promise.all(
          packages.map((pkg) =>
            axios.get(`https://api.npmjs.org/downloads/point/1900-01-01:3000-01-01/${pkg}`)
          )
        );

        const librariesWithDownloads = downloadCounts.map((res, index) => ({
          name: packages[index],
          downloads: res.data.downloads
        }));

        librariesWithDownloads.sort((a, b) => b.downloads - a.downloads);

        setLibraryCount(librariesWithDownloads.length);

        const totalDownloadCount = librariesWithDownloads.reduce((total, lib) => {
          return total + (lib.downloads || 0);
        }, 0);

        setTotalDownloads(totalDownloadCount);
      })
      .catch((error) => {
        setError(error);
        console.error('Error fetching library data:', error);
      });
    }
  }, [githubUsername]);

  if (error) {
    return (
      <Card className="summary-card">
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Error fetching data. Please try again later.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatMillions = (count) => {
    return count >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : count.toString();
  };

  return (
    <Card className="summary-card">
      <CardContent>
        <div className="profile-photo">
          <img src={githubData?.avatar_url} alt="GitHub Profile" />
        </div>
        <CardContent className="profile-details">
          <Typography variant="h5" gutterBottom>
            {githubData?.name}
            <Link href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer">
              <GitHubIcon style={{ marginLeft: 10, verticalAlign: 'middle' }} />
            </Link>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {githubData?.bio}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {githubData?.location}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Followers: {githubData?.followers}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Repositories: {githubData?.public_repos}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Stars: {githubData?.public_gists}
          </Typography>
        </CardContent>
      </CardContent>
    </Card>
  );
}

export default SummarySection;
