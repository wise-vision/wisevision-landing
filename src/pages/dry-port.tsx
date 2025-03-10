import DryPortVisualization from 'components/DryPortVisualization';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a basic dark MUI theme.
const muiTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function DryPort() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <DryPortVisualization />
    </ThemeProvider>
  );
}