import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LibraryCard from './LibraryCard';
import { Container, Grid } from '@mui/material';
import Header from './Header';
import SummarySection from './SummarySection';
import ResultSummary from './ResultSummary';

function App() {
  const defaultNpmUsername = 'abhinaba-ghosh';
  const [npmUsername, setNpmUsername] = useState(defaultNpmUsername);
  const [libraries, setLibraries] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [githubUsername, setGithubUsername] = useState('');
  const [totalDownloads, setTotalDownloads] = useState(0);

  useEffect(() => {
    axios
      .get(`https://registry.npmjs.org/-/v1/search`, {
        params: { text: `maintainer:${npmUsername}` },
      })
      .then((response) => {
        const fetchedLibraries = response.data.objects.map((obj) => obj.package.name);

        // Fetch download counts for all libraries in parallel
        Promise.all(
          fetchedLibraries.map((pkg) =>
            axios.get(
              `https://api.npmjs.org/downloads/point/1970-01-01:${new Date().toISOString().split('T')[0]}/${pkg}`
            )
          )
        )
          .then((responses) => {
            // Calculate total downloads
            const total = responses.reduce((acc, res) => acc + res.data.downloads, 0);
            setTotalDownloads(total);

            // Sort libraries by download count in descending order
            const sortedLibraries = fetchedLibraries.sort((a, b) => {
              const downloadsA = responses.find((res) => res.data.package === a).data.downloads;
              const downloadsB = responses.find((res) => res.data.package === b).data.downloads;
              return downloadsB - downloadsA;
            });

            setLibraries(sortedLibraries);
          })
          .catch((error) => {
            console.error('Error fetching download data:', error);
          });

        const repoObj = response.data.objects.find(
          (obj) => obj.package.links && (obj.package.links.repository || obj.package.links.homepage)
        );
        if (repoObj) {
          const repoUrl = repoObj.package.links.repository || repoObj.package.links.homepage;
          console.log('repoUrl:', repoUrl);
          const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
          console.log('match:', match[1]);
          if (match) {
            setGithubUsername(match[1]);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching libraries:', error);
      });
  }, [npmUsername]);

  return (
    <Container maxWidth="lg">
      <Header npmUsername={npmUsername} setNpmUsername={setNpmUsername} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ResultSummary totalLibraries={libraries.length} totalDownloads={totalDownloads} />
          <SummarySection githubUsername={githubUsername} />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {libraries.map((library, index) => (
              <Grid key={index} item xs={12} sm={6} md={6} lg={6}>
                <LibraryCard
                  packageName={library}
                  expanded={expanded[library]}
                  setExpanded={(value) => setExpanded({ ...expanded, [library]: value })}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
