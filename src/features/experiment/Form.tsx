import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, TextField, Theme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FormInput from 'components/FormInput';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import FileUpload from 'components/FileUpload';
import Spacer from 'components/Spacer';

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

const readFileContent = (file: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.addEventListener('load', (evt: any) => resolve(evt.target.result));
  reader.addEventListener('error', reject);
  reader.readAsText(file);
})
 
const customInputRef = (registerResult: any) => {
  return registerResult;
  /*const ref = registerResult.ref;
  const res = {...registerResult, 'inputRef': ref};
  delete res.ref;
  return res;*/
}

const ExperimentFormComponent: React.FC<ExperimentFormProperties> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { register, formState, handleSubmit, getValues, setError } = useForm();
  const [ fileContents, setFileContents ] = useState({});

  const seedLogField = customInputRef(register('seedLog', {
   // required: t('features.experiment.form.errors.seedLogRequired') as string
  }));
  const screenshotsField = customInputRef(register('screenshots', {
    required: t('features.experiment.form.errors.screenShotsRequired') as string
  }));
  const variabilityField = customInputRef(register('variability_conf', {
    required: t('features.experiment.form.errors.variabilityRequired') as string
  }));
  const scenarioField = customInputRef(register('scenarios_conf', {
    required: t('features.experiment.form.errors.scenarioRequired') as string
  }));

  const formSubmit = (data: any) => {
    const checkedData = {
      ...data,
      special_colnames: JSON.stringify({
        "Case": "Case",
        "Activity": "Activity",
        "Screenshot": "Screenshot",
        "Variant": "Variant"
      }),
      screenshot_name_generation_function: "screenshot_name_without_root_path",
      generation_mode: "autoscenario_mode",
      description: "sample"
    }
    delete checkedData.seedLog;

    if (data.logSize != null && data.imbalancedCase != null) {
      const imbalancedCases = data.imbalancedCase.split(',').map((n: string) => parseFloat(n));
      checkedData.size_balance = JSON.stringify({
        balance: {
          Balanced: Array.from({ length: imbalancedCases.length }, () => 1 / imbalancedCases.length),
          Imbalanced: imbalancedCases
        },
        size_secuence: data.logSize.split(',').map((n: string) => parseFloat(n))
      })

      delete checkedData.logSize;
      delete checkedData.imbalancedCase;
    }


    const formData = new FormData();
    Object.keys(checkedData)
      .forEach(key => {
        const value = (fileContents as any)[key] ?? checkedData[key];
        if (value instanceof FileList) {
          formData.append(key, value[0], value[0].name)
        } else {
          formData.append(key, value)
        }
      });
    onSubmit(formData)
  }
  
  return (
    <RelativeContainer>
        <Card
          style={{ marginTop: theme.spacing(4)}}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={ handleSubmit(formSubmit) }
        >
          <CardContent>
            <FormInput 
              title="features.experiment.form.name.label"
              helperText="features.experiment.form.name.helperText"
              tooltip="features.experiment.form.name.tooltip"
              style={{ marginTop: theme.spacing(2) }}
            >

              
              <TextInputContainer>
                <TextField
                  fullWidth
                  placeholder={t('features.experiment.form.name.placeholder')}
                  defaultValue=""
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
              title="features.experiment.form.seedLog.label"
              helperText="features.experiment.form.seedLog.helperText"
              tooltip="features.experiment.form.seedLog.tooltip"
              style={{ marginTop: theme.spacing(2) }}
            >
              <FileUpload
                accept=".csv"
                errorMessage={ !formState.dirtyFields.seedLog && formState.errors?.seedLog?.message }
                fileName={ (getValues('seedLog')??[])[0]?.name }
                inputProps={{
                  ...seedLogField,
                  onChange: (evt: any) => {
                    seedLogField.onChange(evt);
                    const file = evt.target.files[0];
                    readFileContent(file)
                      .then((content) => {
                        console.log('setting file content: ', content);
                        setFileContents({
                          ...fileContents,
                          seedLog: content,
                        });
                      })
                      .catch((err) => {
                        console.error('error reading file', err);
                        setError('seedLog', err);
                      })
                  }
                }}
              />
            </FormInput>

            <FormInput 
              title="features.experiment.form.screenshots.label"
              helperText="features.experiment.form.screenshots.helperText"
              tooltip="features.experiment.form.screenshots.tooltip"
              style={{ marginTop: theme.spacing(2) }}
            >
              <FileUpload
                accept=".zip"
                errorMessage={ !formState.dirtyFields.screenshots && formState.errors?.screenshots?.message }
                fileName={ (getValues('screenshots')??[])[0]?.name }
                inputProps={ screenshotsField }
              />
            </FormInput>

            <FormInput 
              title="features.experiment.form.scenariosNumber.label"
              helperText="features.experiment.form.scenariosNumber.helperText"
              tooltip="features.experiment.form.scenariosNumber.tooltip"
              style={{ marginTop: theme.spacing(2) }}
            >
              <TextInputContainer>
                <TextField
                  fullWidth
                  defaultValue=""
                  placeholder={t('features.experiment.form.scenariosNumber.placeholder')}
                  inputProps={
                    register('number_scenarios', {
                      required: t('features.experiment.form.errors.scenariosNumberRequired') as string
                    })
                  }
                  error={ formState.errors.scenariosNumber != null }
                  helperText={ formState.errors.scenariosNumber?.message }
                />
              </TextInputContainer>
            </FormInput>


            <FormInput 
              title="features.experiment.form.scenario.label"
              helperText="features.experiment.form.scenario.helperText"
              tooltip="features.experiment.form.scenario.tooltip"
              style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(3) }}
              >
              <FileUpload
                accept=".json"
                errorMessage={ !formState.dirtyFields.scenarios_conf && formState.errors?.scenarios_conf?.message }
                fileName={ (getValues('scenarios_conf')??[])[0]?.name }
                inputProps={{
                  ...scenarioField,
                  onChange: (evt: any) => {
                    scenarioField.onChange(evt);
                    const file = evt.target.files[0];
                    readFileContent(file)
                    .then((content: string) => {
                      setFileContents({
                          ...fileContents,
                          scenarios_conf: content,
                        });
                      })
                      .catch((err) => {
                        console.error('error reading file', err);
                        setError('seedLog', err);
                      })
                    }                    
                  }}
                  />
            </FormInput>
            </CardContent>
            <CardContent>
            <FormInput 
              title="features.experiment.form.logSize.label"
              helperText="features.experiment.form.logSize.helperText"
              tooltip="features.experiment.form.logSize.tooltip"
              style={{ marginTop: theme.spacing(2) }}
              >
              <TextInputContainer>
                <TextField
                  fullWidth
                  defaultValue=""
                  placeholder={t('features.experiment.form.logSize.placeholder')}
                  inputProps={
                    register('logSize', {
                      required: t('features.experiment.form.errors.logSizeRequired') as string
                    })
                  }
                  error={ formState.errors.logSize != null }
                  helperText={ formState.errors.logSize?.message }
                />
              </TextInputContainer>
            </FormInput>

            <FormInput 
              title="features.experiment.form.imbalancedCase.label"
              helperText="features.experiment.form.imbalancedCase.helperText"
              tooltip="features.experiment.form.imbalancedCase.tooltip"
            >
              <TextInputContainer>
                <TextField
                  fullWidth
                  defaultValue=""
                  placeholder={t('features.experiment.form.imbalancedCase.placeholder')}
                  inputProps={
                    register('imbalancedCase', {
                      required: t('features.experiment.form.errors.imbalancedCaseRequired') as string
                    })
                  }
                  error={ formState.errors.imbalancedCase != null }
                  helperText={ formState.errors.imbalancedCase?.message }
                />
              </TextInputContainer>
            </FormInput>

            <FormInput 
              title="features.experiment.form.variability.label"
              helperText="features.experiment.form.variability.helperText"
              tooltip="features.experiment.form.variability.tooltip"
              style={{ marginTop: theme.spacing(2) }}
            >
              <FileUpload
                accept=".json"
                errorMessage={ !formState.dirtyFields.variability_conf && formState.errors?.variability_conf?.message }
                fileName={ (getValues('variability_conf')??[])[0]?.name }
                inputProps={{ 
                  ...variabilityField,
                  onChange: (evt: any) => {
                    variabilityField.onChange(evt);
                    const file = evt.target.files[0];
                    readFileContent(file)
                      .then((content: string) => {
                        setFileContents({
                          ...fileContents,
                          variability_conf: content,
                        });
                      })
                      .catch((err) => {
                        console.error('error reading file', err);
                        setError('seedLog', err);
                      })
                  }
                }}
              />
            </FormInput>
          </CardContent>

          <CardActions>
            <Spacer />
            <Button type="submit" variant="contained" color="primary" endIcon={<SendIcon />}>
                { t('features.experiment.form.generate') }
            </Button>
          </CardActions>
        </Card>
    </RelativeContainer>
  )
}

export default ExperimentFormComponent;