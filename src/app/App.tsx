import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container'; 
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/system';

import Toolbar from 'components/Toolbar';
import Spacer from 'components/Spacer';

import { history } from 'store/store';
import { authSelector, updateRedirectPath, checkSession, logout } from 'features/auth/slice';
import Login from 'features/auth/Login';
import Signup from 'features/auth/Signup';
import ExperimentsList from 'features/experiment/List';
import ExperimentCreation from 'features/experiment/Create';
import ExperimentDetails from 'features/experiment/Details';

import 'infrastructure/i18n/config';
import { useTranslation } from "react-i18next";

import Theme from 'styles/theme';
import PrivateRoute from './helpers/PrivateRoute';

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  marginTop: theme.spacing(3)
}))

function App() {
  const { t } = useTranslation();
  const { isAuth, checked, redirectPath, currentUser } = useSelector( authSelector );
  const dispatch = useDispatch();

  const defaultProtectedRouteProps = {
    auth: isAuth,
    authPath: '/login',
    redirectPath,
    setRedirectPath: (path: string) => dispatch(updateRedirectPath(path)),
  }

  dispatch(checkSession())

  return (
    <>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={ Theme }>
            <CssBaseline />
            <Toolbar>
              <Button variant="text" component={ Link } to="/">
                <Typography variant="h6" color="white" component="div" sx={{ flexGrow: 1 }}>
                  { t('commons:projectName') }
                </Typography>
              </Button>
              <Spacer />
              
              {
                isAuth && (
                  <>
                    <Typography variant="button" color="white" component="div">
                      { currentUser?.email }
                    </Typography>
                    <IconButton onClick={ () => dispatch(logout()) } aria-label="logout">
                      <Typography color="white"><LogoutIcon /></Typography>
                    </IconButton>
                  </>
                )
              }
            </Toolbar>

            { checked && (<StyledContainer maxWidth="xl">
              <Switch>
                <Route exact component={ Login } path="/login" />
                <Route exact component={ Signup } path="/signup" />
                <PrivateRoute {...defaultProtectedRouteProps} component={ ExperimentCreation } path="/add-experiment" />
                <PrivateRoute {...defaultProtectedRouteProps} component={ ExperimentDetails } path="/experiment/:id" />
                <PrivateRoute {...defaultProtectedRouteProps} component={ ExperimentsList } path="/" />
              </Switch>
            </StyledContainer>) }
        </ThemeProvider>
      </ConnectedRouter>
    </>
  );
}

export default App;
