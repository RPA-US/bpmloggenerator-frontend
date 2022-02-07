import React, { useContext } from 'react';
import { Card, CardContent, TextField, Theme } from '@mui/material';
import FormInput from 'components/FormInput';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import FileUpload from 'components/FileUpload';

const TextInputContainer = styled('div')(({ theme }) => {
  const t = theme as any;
  return {
    maxWidth: '100%',
    marginBottom: t.spacing(3),
    [t.breakpoints.up('md')]: {
      maxWidth: `400px`,
      marginBottom: 0,
    }
  }
});

const FirstStepComponent: React.FC = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { register, formState, handleSubmit } = useForm();

  console.log('formState', formState);

  const registerWithCustomRef = (registerResult: any, attributeName: string) => {
    const ref = registerResult.ref;
    const res = {...registerResult, [attributeName]: ref};
    delete res.ref;
    return res;
  }

  return (
    <>
      <Card
        style={{ marginTop: theme.spacing(3) }}
        component="form"
        noValidate
        autoComplete="off"
      >
        <CardContent>
          <FormInput 
            title="features.experiment.firstStep.name.label"
            helperText="features.experiment.firstStep.name.helperText"
          >
            <TextInputContainer>
              <TextField
                fullWidth
                defaultValue=""
                margin="normal"
                inputProps={
                  register('name', {
                    required: t('features.experiment.firstStep.errors.nameRequired') as string
                  })
                }
                error={ formState.errors.name != null }
                helperText={ formState.errors.name?.message }
              />
            </TextInputContainer>
          </FormInput>

          <FormInput 
            title="features.experiment.firstStep.logSize.label"
            helperText="features.experiment.firstStep.logSize.helperText"
          >
            <TextInputContainer>
              <TextField
                fullWidth
                defaultValue=""
                margin="normal"
                inputProps={
                  register('logSize', {
                    required: t('features.experiment.firstStep.errors.logSizeRequired') as string
                  })
                }
                error={ formState.errors.name != null }
                helperText={ formState.errors.name?.message }
              />
            </TextInputContainer>
          </FormInput>

          <FormInput 
            title="features.experiment.firstStep.scenariosNumber.label"
            helperText="features.experiment.firstStep.scenariosNumber.helperText"
          >
            <TextInputContainer>
              <TextField
                fullWidth
                defaultValue=""
                margin="normal"
                inputProps={
                  register('scenariosNumber', {
                    required: t('features.experiment.firstStep.errors.scenariosNumberRequired') as string
                  })
                }
                error={ formState.errors.name != null }
                helperText={ formState.errors.name?.message }
              />
            </TextInputContainer>
          </FormInput>

          <FormInput 
            title="features.experiment.firstStep.seedLog.label"
            helperText="features.experiment.firstStep.seedLog.helperText"
            style={{ marginTop: theme.spacing(2) }}
          >
            <FileUpload
              accept=".json"
              { ...registerWithCustomRef(
                  register('seedLog', {
                  required: t('features.experiment.firstStep.errors.seedLogRequired') as string
                }), 'inputRef') }
            />
          </FormInput>

          <FormInput 
            title="features.experiment.firstStep.variability.label"
            helperText="features.experiment.firstStep.variability.helperText"
            style={{ marginTop: theme.spacing(2) }}
          >
            <FileUpload
              accept=".json"
              { ...registerWithCustomRef(register('variability', {
                required: t('features.experiment.firstStep.errors.variabilityRequired') as string
              }), 'inputRef') }
            />
          </FormInput>
        </CardContent>
      </Card>
    </>
  )
}

export default FirstStepComponent;