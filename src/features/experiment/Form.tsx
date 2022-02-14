import React, { useContext } from 'react';
import { Box, Button, Card, CardContent, TextField, Theme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FormInput from 'components/FormInput';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import FileUpload from 'components/FileUpload';

const TextInputContainer = styled('div')(({ theme }) => {
  const t = theme as any;
  return {
    maxWidth: '100%',
    marginBottom: t.spacing(2),
    [t.breakpoints.up('md')]: {
      maxWidth: `400px`,
      marginBottom: 0,
    }
  }
});

const RelativeContainer = styled('div')`
  position: relative;
`

export interface ExperimentFormProperties {
  onSubmit: any
}

const ExperimentFormComponent: React.FC<ExperimentFormProperties> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { register, formState, handleSubmit, watch } = useForm();

  const registerWithCustomRef = (registerResult: any, attributeName: string) => {
    const ref = registerResult.ref;
    const res = {...registerResult, [attributeName]: ref};
    delete res.ref;
    return res;
  }

  const seedLog = watch('seedLog');

  console.log('seedLog', seedLog, 'formState', formState);

  return (
    <RelativeContainer>
      <form onSubmit={ handleSubmit(onSubmit) }>
        <Card
          style={{ marginTop: theme.spacing(4)}}
          component="form"
          noValidate
          autoComplete="off"
        >
          <CardContent>
            <FormInput 
              title="features.experiment.form.name.label"
              helperText="features.experiment.form.name.helperText"
            >
              <TextInputContainer>
                <TextField
                  fullWidth
                  defaultValue=""
                  margin="normal"
                  inputProps={
                    register('name', {
                      required: t('features.experiment.form.errors.nameRequired') as string
                    })
                  }
                  error={ formState.errors.name != null }
                  helperText={ formState.errors.name?.message }
                />
              </TextInputContainer>
            </FormInput>

            <FormInput 
              title="features.experiment.form.logSize.label"
              helperText="features.experiment.form.logSize.helperText"
            >
              <TextInputContainer>
                <TextField
                  fullWidth
                  defaultValue=""
                  margin="normal"
                  inputProps={
                    register('logSize', {
                      required: t('features.experiment.form.errors.logSizeRequired') as string
                    })
                  }
                  error={ formState.errors.name != null }
                  helperText={ formState.errors.name?.message }
                />
              </TextInputContainer>
            </FormInput>

            <FormInput 
              title="features.experiment.form.scenariosNumber.label"
              helperText="features.experiment.form.scenariosNumber.helperText"
            >
              <TextInputContainer>
                <TextField
                  fullWidth
                  defaultValue=""
                  margin="normal"
                  inputProps={
                    register('scenariosNumber', {
                      required: t('features.experiment.form.errors.scenariosNumberRequired') as string
                    })
                  }
                  error={ formState.errors.name != null }
                  helperText={ formState.errors.name?.message }
                />
              </TextInputContainer>
            </FormInput>

            <FormInput 
              title="features.experiment.form.seedLog.label"
              helperText="features.experiment.form.seedLog.helperText"
              style={{ marginTop: theme.spacing(2) }}
            >
              <FileUpload
                accept=".csv"
                { ...registerWithCustomRef(
                    register('seedLog', {
                    required: t('features.experiment.form.errors.seedLogRequired') as string
                  }), 'inputRef') }
              />
            </FormInput>

            <FormInput 
              title="features.experiment.form.screenshots.label"
              helperText="features.experiment.form.screenshots.helperText"
              style={{ marginTop: theme.spacing(2) }}
            >
              <FileUpload
                accept=".zip"
                { ...registerWithCustomRef(
                    register('screenshots', {
                    required: t('features.experiment.form.errors.screenshotsRequired') as string
                  }), 'inputRef') }
              />
            </FormInput>

            <FormInput 
              title="features.experiment.form.variability.label"
              helperText="features.experiment.form.variability.helperText"
              style={{ marginTop: theme.spacing(2) }}
            >
              <FileUpload
                accept=".json"
                { ...registerWithCustomRef(register('variability', {
                  required: t('features.experiment.form.errors.variabilityRequired') as string
                }), 'inputRef') }
              />
            </FormInput>
              
            <FormInput 
              title="features.experiment.form.scenario.label"
              helperText="features.experiment.form.scenario.helperText"
              style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(3) }}
            >
              <FileUpload
                accept=".json"
                { ...registerWithCustomRef(register('scenario', {
                  required: t('features.experiment.form.errors.scenarioRequired') as string
                }), 'inputRef') }
              />
            </FormInput>

            <FormInput 
              title="features.experiment.form.unbalancedCases.label"
              helperText="features.experiment.form.unbalancedCases.helperText"
            >
              <TextInputContainer>
                <TextField
                  fullWidth
                  defaultValue=""
                  margin="normal"
                  inputProps={
                    register('unbalancedCases', {
                      required: t('features.experiment.form.errors.unbalancedCasesRequired') as string
                    })
                  }
                  error={ formState.errors.name != null }
                  helperText={ formState.errors.name?.message }
                />
              </TextInputContainer>
            </FormInput>
          </CardContent>
        </Card>

        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
        }}>
          <Button type="submit" variant="contained" color="primary" endIcon={<SendIcon />}>
              { t('features.experiment.form.generate') }
          </Button>
        </Box>
      </form>
    </RelativeContainer>
  )
}

export default ExperimentFormComponent;