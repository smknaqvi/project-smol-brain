import { createMuiTheme } from '@material-ui/core/styles';
import background from '../media/tile-background.png';

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
        margin: '8px',
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
      },
    },
    //https://codesandbox.io/s/v30yq681ql?file=/src/withRoot.js:645-834
    // lol do the mui folks just expect people to know to do this???
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundImage: `url(${background})`,
        },
      },
    },
  },
  spacing: 4,
});

export default theme;
