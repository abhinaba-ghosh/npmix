import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import DownloadIcon from '@mui/icons-material/GetApp';

function formatDownloads(count) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

function ResultSummary({ totalLibraries, totalDownloads }) {
  return (
    <Card sx={{ margin: 2, padding: 2, backgroundColor: '#f5f5f5' }}>
      <CardContent>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={6} md={6}>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LibraryBooksIcon color="primary" sx={{ mr: 1 }} />
              {totalLibraries} Libraries
            </Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DownloadIcon color="secondary" sx={{ mr: 1 }} />
              {formatDownloads(totalDownloads)} Downloads
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ResultSummary;
