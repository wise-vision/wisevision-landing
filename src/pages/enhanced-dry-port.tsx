import ErrorBoundary from '../components/ErrorBoundary';
import EnhancedDryPortVisualization from '../components/EnhancedDryPortVisualization';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';

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
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Head>
        <title>WiseVision | Enhanced Dry Port Visualization</title>
        <meta name="description" content="Advanced 3D visualization of an integrated dry port with real-time IoT data" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Orbitron:wght@400;500;700&family=Roboto+Mono&display=swap" rel="stylesheet" />
      </Head>
      <ErrorBoundary>
        <EnhancedDryPortVisualization />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
