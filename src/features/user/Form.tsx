import React, { useContext } from 'react';
import { Button, Card, CardActions, CardContent, TextField, Theme, Typography } from '@mui/material';
import { ThemeContext } from '@mui/styled-engine';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import { ErrorOption, useForm } from 'react-hook-form';

import FormInput from 'components/FormInput';
import TextInputContainer from 'components/TextInputContainer';
import Validations from 'infrastructure/util/validations';
import Spacer from 'components/Spacer';

export interface UserFormProperties {
  onSubmit: any
  disabled?: boolean,
  initialValues?: any
}

const UserForm: React.FC<UserFormProperties> = ({ onSubmit, disabled = false, initialValues = {} }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { register, formState, handleSubmit, getValues, resetField, watch, setError } = useForm();

  const validateForm = (data: any) => {
    let valid = true;
    const setFormError = (field: string, error: ErrorOption) => {
      valid = false;
      setError(field, error);
    }

    if (Validations.isBlank(data.email)) setFormError('email', { type: 'required', message: t('features.user.form.errors.emailRequired') as string });
    // TODO FIX MAX LENGTH?
    return valid;
  }

  const formSubmit = (data: any) => {
    if (!validateForm(data)) {
      return false;
    }

    const checkedData = {
      ...data,
    }

    const formData = new FormData();
    
    Object.entries(checkedData)
      .forEach(entry => {
        const [ key, value ]: [string, any] = entry;
        if (typeof value === 'string') {
          if (value.trim() !== '') formData.append(key, value.trim())
        } else {
          formData.append(key, value)
        }
      });

    onSubmit(formData)
  }

  return (<div>
    <Card
      style={{ marginTop: theme.spacing(4) }}
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(formSubmit)}
    >
      <CardContent>

        <FormInput
          title="features.user.form.username.label"
          style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2) }}
          labelGridValue={ 2 }
          valueGridValue={ 10 }
        >
          <TextInputContainer>
            <TextField
              fullWidth
              disabled={ true }
              value={ initialValues.displayName }
            />
          </TextInputContainer>
        </FormInput>

        <FormInput
          title="features.user.form.firstName.label"
          style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2) }}
          labelGridValue={ 2 }
          valueGridValue={ 10 }
        >
          <TextInputContainer>
            <TextField
              fullWidth
              placeholder={t('features.user.form.firstName.placeholder')}
              inputProps={
                register('first_name', {
                  // required: t('features.experiment.form.errors.firstNameRequired') as string,
                  value: initialValues.firstName
                })
              }
              error={formState.errors.firstName != null}
              helperText={formState.errors.firstName?.message}
              disabled={ disabled }
            />
          </TextInputContainer>
        </FormInput>

        <FormInput
          title="features.user.form.lastName.label"
          style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2) }}
          labelGridValue={ 2 }
          valueGridValue={ 10 }
        >
          <TextInputContainer>
            <TextField
              fullWidth
              placeholder={t('features.user.form.lastName.placeholder')}
              inputProps={
                register('last_name', {
                  // required: t('features.experiment.form.errors.lastNameRequired') as string,
                  value: initialValues.lastName
                })
              }
              error={formState.errors.lastName != null}
              helperText={formState.errors.lastName?.message}
              disabled={ disabled }
            />
          </TextInputContainer>
        </FormInput>

        <FormInput
          title="features.user.form.email.label"
          style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2) }}
          labelGridValue={ 2 }
          valueGridValue={ 10 }
        >
          <TextInputContainer>
            <TextField
              fullWidth
              placeholder={t('features.user.form.email.placeholder')}
              inputProps={
                register('email', {
                  // required: t('features.experiment.form.errors.emailRequired') as string,
                  value: initialValues.email
                })
              }
              error={formState.errors.email != null}
              helperText={formState.errors.email?.message}
              disabled={ disabled }
            />
          </TextInputContainer>
        </FormInput>

        { /*<Typography variant="h6" style={{ margin: theme.spacing(2) }}>
          Cambio de contraseña
        </Typography>
        <Typography variant="body1" style={{ marginLeft: theme.spacing(2) }}>
          Para cambiarla debes introducir la actual y la nueva dos veces para después, pulsar sobre actualizar
        </Typography>

        <FormInput
          title="features.user.form.currentPassword.label"
          style={{ marginTop: theme.spacing(3), marginLeft: theme.spacing(2) }}
          labelGridValue={ 2 }
          valueGridValue={ 10 }
        >
          <TextInputContainer>
            <TextField
              fullWidth
              placeholder={t('features.user.form.currentPassword.placeholder')}
              inputProps={
                register('currentPassword', {
                  // required: t('features.experiment.form.errors.currentPasswordRequired') as string,
                  value: initialValues.currentPassword
                })
              }
              error={formState.errors.currentPassword != null}
              helperText={formState.errors.currentPassword?.message}
              disabled={ disabled }
            />
          </TextInputContainer>
        </FormInput>

        <FormInput
          title="features.user.form.password.label"
          style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2) }}
          labelGridValue={ 2 }
          valueGridValue={ 10 }
        >
          <TextInputContainer>
            <TextField
              fullWidth
              placeholder={t('features.user.form.password.placeholder')}
              inputProps={
                register('password', {
                  // required: t('features.experiment.form.errors.passwordRequired') as string,
                  value: initialValues.password
                })
              }
              error={formState.errors.password != null}
              helperText={formState.errors.password?.message}
              disabled={ disabled }
            />
          </TextInputContainer>
        </FormInput>

        <FormInput
          title="features.user.form.repeatedPassword.label"
          style={{ marginTop: theme.spacing(2), marginLeft: theme.spacing(2) }}
          labelGridValue={ 2 }
          valueGridValue={ 10 }
        >
          <TextInputContainer>
            <TextField
              fullWidth
              inputProps={
                register('repeatedPassword', {
                  required: getValues('password') != null && t('features.experiment.form.errors.repeatedPasswordRequired') as string,
                })
              }
              error={formState.errors.repeatedPassword != null}
              helperText={formState.errors.repeatedPassword?.message}
              disabled={ disabled }
            />
          </TextInputContainer>
        </FormInput>

             */}
      </CardContent>
      <CardActions style={{ marginRight: theme.spacing(2) }}>
          <Spacer />

          <Button type="submit" name="save" variant="contained" color="primary" endIcon={<SaveIcon />} disabled={ disabled }>
            {t('features.user.form.save')}
          </Button>
        </CardActions>
    </Card>
  </div>)
}

export default UserForm