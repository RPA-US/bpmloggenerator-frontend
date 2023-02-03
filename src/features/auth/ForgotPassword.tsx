import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Box, Button, Card, CardContent, Grid, TextField, Theme, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { authSelector } from './slice';
import { useTranslation } from 'react-i18next';
import Spacer from 'components/Spacer';
import { ThemeContext } from '@emotion/react';
import AuthRepository from 'infrastructure/repositories/auth';
import NotificationFactory from 'features/notifications/notification';
import { showNotification } from 'features/notifications/slice';

const ForgotPasswordBoxContainer = styled('div')`
  position: absolute;
  transform: translateX(-50%) translateY(-50%);
  top: 50%;
  left: 50%
`;

const authRepository = new AuthRepository();

export default function ForgotPassword(): JSX.Element {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext) as Theme;
  const [ isLoading, setLoading ] = useState(false);
  
  const { reset, register, setError, clearErrors, formState, handleSubmit } = useForm();
  const { isAuth, redirectPath, error } = useSelector( authSelector );
  // const [ displayError, setDisplayError ] = useState(false)

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    authRepository.resetPassword(data.email)
      .then(() => {
        const notification = NotificationFactory.success(t('features.auth.login.forgotPasswordSuccess'))
          .dismissible()
          .build();

        setTimeout(() => {
          dispatch(showNotification(notification));
        }, 0)

        history.push('/');
      })
      .catch((ex) => {
        console.error('there was a problem requesting password recovering', ex)
        const notification = NotificationFactory.success(t('features.auth.login.forgotPasswordError' + ex))
          .dismissible()
          .build();

        setTimeout(() => {
          dispatch(showNotification(notification));
        }, 0)

      })
      .finally(() => {
        setLoading(false)
      })

  }

  useEffect(() => {
    if (isAuth) {
      history.push(redirectPath);
    }
    if (error) {
      console.error('ERROR: ', error);
    }
  }, [ isAuth, error ]);

  return (
    <ForgotPasswordBoxContainer>
        <Card>
          <CardContent>
            <Typography variant="h5">{ t('features.auth.forgotPassword.title') }</Typography>
            
            <Box sx={{ width: 1 }}>
              <form onSubmit={ handleSubmit(onSubmit) }>

                <Typography style={{ marginTop: theme.spacing(3) }}>
                { t('features.auth.forgotPassword.description') }
                </Typography>


                <TextField
                  fullWidth
                  label={ t('features.auth.forgotPassword.email') }
                  defaultValue=""
                  margin="normal"
                  inputProps={
                    register('email', {
                      required: t('features.auth.forgotPassword.errors.emailRequired') as string
                    })
                  }
                  error={ formState.errors.email != null }
                  helperText={ formState.errors.email?.message }
                />

                <Grid container style={{ marginTop: theme.spacing(2) }}>
                  <Grid item>
                    <Button 
                      variant="contained"
                      color="secondary"
                      disabled={ isLoading }
                      href="login"
                    >
                      { t('features.auth.forgotPassword.goBack') }
                    </Button>
                  </Grid>
                  <Spacer />
                  <Grid item>
                    <Button 
                      variant="contained"
                      color="secondary"
                      type='submit'
                      disabled={ isLoading }
                    >
                      { t('features.auth.forgotPassword.sendRequest') }
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </CardContent>
        </Card>
    </ForgotPasswordBoxContainer>)
}