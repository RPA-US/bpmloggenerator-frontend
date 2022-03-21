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
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/system';
import configuration from "infrastructure/util/configuration";

import Toolbar from 'components/Toolbar';
import Spacer from 'components/Spacer';

import { history } from 'store/store';
import { authSelector, updateRedirectPath, checkSession, logout, signup } from 'features/auth/slice';
import Login from 'features/auth/Login';
import Signup from 'features/auth/Signup';
import ExperimentsList from 'features/experiment/List';
import ExperimentCreation from 'features/experiment/Create';
import ExperimentDetails from 'features/experiment/Details';
import ExperimentGetGUIComponentsCoordenates from 'features/experiment/wizard/GUIComponentsCoordenates';
import ExperimentAssist from 'features/experiment/wizard/ActivitySelection';
import ScenarioSelection from 'features/experiment/wizard/ScenarioSelection';
import ColumnVariability from 'features/experiment/wizard/ColumnVariability'
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
    authPath: configuration.PREFIX+'/login',
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
              <Button variant="text" component={ Link } to={`${configuration.PREFIX}/`}>
                <Typography variant="h6" color="white" component="div" sx={{ flexGrow: 1 }} >
                  { t('commons:projectName') }
                </Typography>
              </Button>
              <Spacer />
              
              {
                isAuth ? (
                  <>
                    <Typography variant="button" color="white" component="div">
                      { currentUser?.email }
                    </Typography>
                    <IconButton onClick={ () => dispatch(logout()) } aria-label="logout">
                      <Typography color="white"><LogoutIcon /></Typography>
                    </IconButton>
                  </>
                ) :
                (
                  <>
                    <Button component={ Link } to={`${configuration.PREFIX}/login`}>
                      <Typography color="white">Login</Typography>
                    </Button>
                    <Button component={ Link } to={`${configuration.PREFIX}/signup`}>
                      <Typography color="white">Sign up</Typography>
                    </Button>
                  </>
                )
              }
            </Toolbar>

            { checked && (<StyledContainer maxWidth="xl">
              <Switch>
                <Route exact component={ Login } path={`${configuration.PREFIX}/login`} />
                <Route exact component={ Signup } path={`${configuration.PREFIX}/signup`} />
                <PrivateRoute {...defaultProtectedRouteProps} component={ ExperimentCreation } path={`${configuration.PREFIX}/add-experiment`} />
                <PrivateRoute {...defaultProtectedRouteProps} component={ ExperimentDetails } path={`${configuration.PREFIX}/experiment/:id`} />
                {/* <PrivateRoute {...defaultProtectedRouteProps} component={ ExperimentDownload } path=`${configuration.PREFIX}/experiment/download/:id" /> */}
                <PrivateRoute {...defaultProtectedRouteProps} component={ ExperimentAssist } path={`${configuration.PREFIX}/case-variability`} />
                <PrivateRoute {...defaultProtectedRouteProps} component={ ExperimentGetGUIComponentsCoordenates } path={`${configuration.PREFIX}/get-gui-component-coordinates/:variability_mode/:variant/:act/:screenshot_filename`} />
                <PrivateRoute {...defaultProtectedRouteProps} component={ ColumnVariability } path={`${configuration.PREFIX}/column-variability/:variant/:act`} />
                <PrivateRoute {...defaultProtectedRouteProps} component={ ScenarioSelection } path={`${configuration.PREFIX}/scenario-variability`} />
                <PrivateRoute {...defaultProtectedRouteProps} component={ ExperimentsList } path={`${configuration.PREFIX}/`} />
              </Switch>
            </StyledContainer>) }
        </ThemeProvider>
      </ConnectedRouter>
    </>
  );
}

export default App;
