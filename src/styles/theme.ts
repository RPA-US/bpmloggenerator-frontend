import { createTheme } from '@mui/material/styles';

export const themeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#383433',
    },
    secondary: {
      main: '#115953',
    },
    background: {
      default: '#E6E6E6',
    },
  },
};

const theme = createTheme(themeOptions);
export default theme;