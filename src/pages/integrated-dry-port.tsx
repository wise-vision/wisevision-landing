import IntegratedDryPortVisualization from '../components/IntegratedDryPortVisualization';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a dark theme
const muiTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function IntegratedDryPort() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <IntegratedDryPortVisualization />
    </ThemeProvider>
  );
}
