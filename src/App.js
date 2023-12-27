import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LibraryCard from './LibraryCard';
import { Container, Grid } from '@mui/material';
import Header from './Header'; // Import Header component
import SummarySection from './SummarySection'; // Import SummarySection component

function App() {
  const [libraries, setLibraries] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    axios.get('https://registry.npmjs.org/-/v1/search', {
      params: { text: 'maintainer:abhinaba-ghosh' }
    }).then(async (response) => {
      const packages = response.data.objects.map(obj => obj.package.name);

      const downloadCounts = await Promise.all(packages.map(pkg => 
        axios.get(`https://api.npmjs.org/downloads/point/1900-01-01:3000-01-01/${pkg}`)
      ));

      const librariesWithDownloads = downloadCounts.map((res, index) => ({
        name: packages[index],
        downloads: res.data.downloads
      }));

      librariesWithDownloads.sort((a, b) => b.downloads - a.downloads);

      setLibraries(librariesWithDownloads);
    }).catch(error => console.error('Error fetching library names:', error));
  }, []);

  return (
    <Container>
      <Header /> {/* Add the Header component */}
      <SummarySection /> {/* Add the SummarySection component */}
      <Grid container spacing={3}>
        {libraries.map((lib, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <LibraryCard packageName={lib.name} expanded={expanded[lib.name]} setExpanded={(value) => setExpanded({ ...expanded, [lib.name]: value })} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;
