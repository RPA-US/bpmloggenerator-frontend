import React, { useEffect } from 'react';
import { styled } from '@mui/system';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { login, authSelector } from './slice';
import { useTranslation } from 'react-i18next';

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
  const { register, formState, handleSubmit } = useForm();
  const { isLoading, isAuth, redirectPath, error } = useSelector( authSelector );

  const onSubmit = (data: any) => {
    const { email, password } = data;
    dispatch(login({ email, password }));
    console.log('data', data);
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
    <LoginBoxContainer>
        <Card>
          <CardContent>
            <Typography variant="h5">{ t('features.auth.login.title') }</Typography>

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

              <Button variant="contained" color="secondary" type='submit'>
                { t('features.auth.login.login') }
              </Button>
            </form>
          </CardContent>
        </Card>
    </LoginBoxContainer>)
}