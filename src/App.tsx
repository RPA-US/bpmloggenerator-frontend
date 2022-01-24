import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from 'components/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container'; 
import { styled } from '@mui/system';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from 'routes';
import 'infrastructure/i18n/config';
import { useTranslation } from "react-i18next";

import Theme from 'styles/theme';

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  marginTop: theme.spacing(3)
}))

function App() {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Router>
        <ThemeProvider theme={ Theme }>
            <CssBaseline />
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{ t('commons:projectName') }</Typography>
            </Toolbar>

            <StyledContainer maxWidth="xl">
              <Switch>
                { routes.map((route, idx) => (
                    <Route key={idx} {...route } />
                ))}
              </Switch>
            </StyledContainer>
        </ThemeProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
