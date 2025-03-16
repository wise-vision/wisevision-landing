import React, { useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import EnhancedDryPortVisualization from '../components/EnhancedDryPortVisualization';
import EnhancedDryPortSimulation from '../components/EnhancedDryPortSimulation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { Button, Box } from '@mui/material';

// Create a dark theme optimized for 3D visualization
const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#000000',
      paper: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
  },
});

export default function EnhancedDryPort() {
  // Change initial state to 'simulation' to make it the default
  const [displayMode, setDisplayMode] = useState<'visualization' | 'simulation'>('simulation');

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Head>
        <title>WiseVision | Enhanced Dry Port Visualization</title>
        <meta name="description" content="Advanced 3D visualization of an integrated dry port with real-time IoT data" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Orbitron:wght@400;500;700&family=Roboto+Mono&display=swap" rel="stylesheet" />
      </Head>
      
      <ErrorBoundary>
        {displayMode === 'visualization' ? (
          <EnhancedDryPortVisualization />
        ) : (
          <EnhancedDryPortSimulation />
        )}
      </ErrorBoundary>
    </ThemeProvider>
  );
}
