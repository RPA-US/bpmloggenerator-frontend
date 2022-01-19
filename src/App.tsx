import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from 'components/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container'; 

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from 'routes';
import 'infrastructure/i18n/config';
import { useTranslation } from "react-i18next";

import Theme from 'styles/theme';

function App() {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <CssBaseline />
      <Router>
        <ThemeProvider theme={ Theme }>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{ t('commons:projectName') }</Typography>
            </Toolbar>

            <Container maxWidth="xl">
              <Switch>
                { routes.map((route, idx) => (
                    <Route key={idx} {...route } />
                ))}
              </Switch>
            </Container>
        </ThemeProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
