import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      contrastText: 'rgba(0, 0, 0, 0.87)',
      dark: 'rgb(0, 131, 148)',
      light: 'rgb(51, 201, 220)',
      main: '#00bcd4',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        padding: '8px',
      },
    },
    MuiTextField: {
      root: {
        margin: '8px',
      },
    },
    MuiCard: {
      root: {
        padding: '12px',
      }
    }
  },
  spacing: 4,
});

export default theme;
