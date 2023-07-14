import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useForm, ErrorOption } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { signup, authSelector, checkPassword } from './slice';
import { useTranslation } from 'react-i18next';

const LoginBoxContainer = styled('div')`
  position: absolute;
  transform: translateX(-50%) translateY(-50%);
  top: 50%;
  left: 50%
`;

const SpacedSubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2)
}))

export default function Signup(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { reset, register, setError, clearErrors, formState, handleSubmit } = useForm();
  const { isLoading, isAuth, redirectPath, error } = useSelector( authSelector );
  // const [ displayError, setDisplayError ] = useState(false)

  const validateForm = (data: any) => {
    let valid = true;
    const setFormError = (field: string, error: ErrorOption) => {
      valid = false;
      setError(field, error);
    }
    if (typeof data.password1 !== "undefined" && typeof data.password2 !== "undefined") {
      if(data.password1 != data.password2)
        setFormError('password2', { type: 'required', message: t('features.auth.signup.errors.passwordConfirmation') as string });
      if(!checkPassword(data.password1))
        setFormError('password1', { type: 'required', message: t('features.auth.signup.errors.passwordInvalid') as string });
    }
    return valid;
  }

  const onSubmit = async (data: any) => {
     
    if (!validateForm(data)) {
      return false;
    }

    if (!isLoading) {
      const { email, password1, password2 } = data;
      clearErrors();
      await dispatch(signup({ email, password1, password2 }));
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
            <Typography variant="h5">{ t('features.auth.signup.title') }</Typography>
            
            <Box sx={{ width: 1 }}>
              <form onSubmit={ handleSubmit(onSubmit) }>
                <TextField
                  fullWidth
                  label={ t('features.auth.signup.email') }
                  defaultValue=""
                  margin="normal"
                  inputProps={
                    register('email', {
                      required: t('features.auth.signup.errors.emailRequired') as string
                    })
                  }
                  error={ formState.errors.email != null }
                  helperText={ formState.errors.email?.message }
                />

                <TextField
                  fullWidth
                  label={ t('features.auth.signup.password') }
                  defaultValue=""
                  margin="normal"
                  inputProps={
                    register('password1', {
                      required: t('features.auth.signup.errors.passwordRequired') as string
                    })
                  }
                  error={ formState.errors.password1 != null}
                  helperText={ formState.errors.password1?.message }
                  type="password"
                />

                <TextField
                  fullWidth
                  label={ t('features.auth.signup.confirmpassword') }
                  defaultValue=""
                  margin="normal"
                  inputProps={
                    register('password2', {
                      required: t('features.auth.signup.errors.passwordRequired') as string
                    })
                  }
                  error={ formState.errors.password2 != null}
                  helperText={ formState.errors.password2?.message }
                  type="password"
                />

                {  displayError && (
                  <>
                    { error?.code === 'invalid.credentials' && (<Typography color="error" variant="body2">{ t('features.auth.signup.errors.invalidcredentials') }</Typography>)}
                  </>
                ) }

                <SpacedSubmitButton 
                  variant="contained"
                  color="secondary"
                  type='submit'
                  disabled={ isLoading }
                >
                  { t('features.auth.signup.signup') }
                </SpacedSubmitButton>
              </form>
            </Box>
          </CardContent>
        </Card>
    </LoginBoxContainer>)
}