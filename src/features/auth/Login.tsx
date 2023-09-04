import React, { useContext, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Button, Card, CardContent, Grid, TextField, Theme, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { login, authSelector } from './slice';
import { useTranslation } from 'react-i18next';
import Spacer from 'components/Spacer';
import { ThemeContext } from '@emotion/react';
import configuration from 'infrastructure/util/configuration';

const LoginBoxContainer = styled('div')`
  position: absolute;
  transform: translateX(-50%) translateY(-50%);
  top: 50%;
  left: 50%
`;

export default function Login(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useContext(ThemeContext) as Theme;
  
  const { reset, register, setError, clearErrors, formState, handleSubmit } = useForm();
  const { isLoading, isAuth, redirectPath, error } = useSelector( authSelector );
  // const [ displayError, setDisplayError ] = useState(false)

  const onSubmit = async (data: any) => {
    if (!isLoading) {
      const { email, password } = data;
      clearErrors();
      await dispatch(login({ email, password }));
      reset(data);
    }
  }

  const displayError = !isLoading && !formState.isDirty && error != null && error.code != null;

  useEffect(() => {
    if (isAuth) {
      history.push(redirectPath);
    }
    if (error) {
      console.error('ERROR: ', error);
    }
  }, [ isAuth, error ]);

  return (
    <LoginBoxContainer>
        <Card>
          <CardContent>
            <Typography variant="h5">{ t('features.auth.login.title') }</Typography>
            
            <Box sx={{ width: 1 }}>
              <form onSubmit={ handleSubmit(onSubmit) }>
                <TextField
                  fullWidth
                  label={ t('features.auth.login.email') }
                  defaultValue=""
                  margin="normal"
                  inputProps={
                    register('email', {
                      required: t('features.auth.login.errors.emailRequired') as string
                    })
                  }
                  error={ formState.errors.email != null }
                  helperText={ formState.errors.email?.message }
                />

                <TextField
                  fullWidth
                  label={ t('features.auth.login.password') }
                  defaultValue=""
                  margin="normal"
                  inputProps={
                    register('password', {
                      required: t('features.auth.login.errors.passwordRequired') as string
                    })
                  }
                  error={ formState.errors.password != null}
                  helperText={ formState.errors.password?.message }
                  type="password"
                />

                {  displayError && (
                  <>
                    { error?.code === 'invalid.credentials' && (<Typography color="error" variant="body2">{ t('features.auth.login.errors.invalidCredentials') }</Typography>)}
                    { error?.code === 'invalid.login' && (<Typography color="error" variant="body2">{ t('features.auth.login.errors.invalid') }</Typography>)}
                  </>
                ) }

                <Grid container alignItems="center" style={{ marginTop: theme.spacing(2) }}>
                  <Grid item>
                    <Button 
                      variant="contained"
                      color="secondary"
                      type='submit'
                      disabled={ isLoading }
                    >
                      { t('features.auth.login.login') }
                    </Button>
                  </Grid>
                  <Spacer />
                  { configuration.ENABLE_EMAIL && (
                    <Grid item>
                      <Link to="forgot-password">
                        <Typography variant="body2">
                        { t('features.auth.login.forgotPassword') }
                        </Typography>
                      </Link>
                    </Grid>
                  )}
                </Grid>
              </form>
            </Box>
          </CardContent>
        </Card>
    </LoginBoxContainer>)
}