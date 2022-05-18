import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, TextField, Theme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import FormInput from 'components/FormInput';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { ErrorOption, SubmitHandler, useForm, ValidationRule } from 'react-hook-form';
import styled from '@emotion/styled';
import FileUpload from 'components/FileUpload';
import Spacer from 'components/Spacer';
import Validations from 'infrastructure/util/validations';
import TextInputContainer from 'components/TextInputContainer';
import { objectToFormData } from 'infrastructure/util/form';

const RelativeContainer = styled('div')`
  position: relative;
`

export interface ExperimentFormProperties {
  onSubmit: any
  disabled?: boolean,
  initialValues?: any
}

const readFileContent = (file: Blob) => new Promise<string>((resolve, reject) => {
  if (file == null) {
    reject(new Error('file cannot be null or undefined'));
  }
  const reader = new FileReader();
  reader.addEventListener('load', (evt: any) => resolve(evt.target.result));
  reader.addEventListener('error', reject);
  reader.readAsText(file);
});

const ExperimentFormComponent: React.FC<ExperimentFormProperties> = ({ onSubmit, disabled = false, initialValues = {}}) => {
  // hook to force component update manually
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({} as any), []);
  
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { register, formState, handleSubmit, getValues, resetField, watch, setError } = useForm();
  const [fileContents, setFileContents]: [ any, React.Dispatch<React.SetStateAction<any>> ] = useState({});

  const seedLogField = register('seedLog');
  const screenshotsField = register('screenshots');
  const variabilityField = register('variability_conf');
  const scenarioField = register('scenarios_conf');

  const watchNumberScenarios = watch('number_scenarios');

  useEffect(() => {
    if (watchNumberScenarios == 0) {
      resetField('scenarios_conf')
      delete fileContents.scenarios_conf;
    }
  }, [watchNumberScenarios])

  useEffect(() => {
    let scenarios_conf;
    let variability_conf;
    if (initialValues.scenariosConf != null) {
      scenarios_conf = JSON.stringify(initialValues.scenariosConf)
    }
    if (initialValues.variabilityConf != null) {
      variability_conf = JSON.stringify(initialValues.variabilityConf)
    }
    setFileContents({
      ...fileContents,
      scenarios_conf,
      variability_conf,
    });
  }, [ ])

  const wizzardDisabled = getValues('name') == null || getValues('seedLog').length == 0 || (getValues('screenshots').length == 0 && initialValues.screenshotsPath == null);
  const scenariosConfDisabled = !((getValues('number_scenarios') ?? 0) > 0);

  const validateForm = (data: any, submitter: string) => {
    let valid = true;
    const setFormError = (field: string, error: ErrorOption) => {
      valid = false;
      setError(field, error);
    }
    if (submitter === 'generate') {
      // if (fileContents.seedLog == null) setError({ type: 'required', message: t('features.experiment.form.errors.seedLogRequired') as string });
      if ((data.screenshots == null || data.screenshots.length < 1) && (initialValues.screenshotsPath == null || initialValues.screenshotsPath === '')) setFormError('screenshots', { type: 'required', message: t('features.experiment.form.errors.screenShotsRequired') as string });
      if (fileContents.variability_conf == null && initialValues.variabilityConf == null) setFormError('variability_conf', { type: 'required', message: t('features.experiment.form.errors.variabilityRequired') as string });
      if (Validations.isPositiveInteger(data.number_scenarios) && data.number_scenarios > 0 && fileContents.scenarios_conf == null && initialValues.scenariosConf == null) setFormError('scenarios_conf', { type: 'required', message: t('features.experiment.form.errors.scenarioRequired') as string });
      if (!Validations.isPositiveInteger(data.number_scenarios)) setFormError('number_scenarios', { type: 'required', message: t('features.experiment.form.errors.scenariosNumberRequired') as string });
      if (Validations.isBlank(data.logSize)) setFormError('logSize', { type: 'required', message: t('features.experiment.form.errors.logSizeRequired') as string });
      if (Validations.isBlank(data.imbalancedCase)) {
        setFormError('imbalancedCase', { type: 'required', message: t('features.experiment.form.errors.imbalancedCaseRequired') as string });
      } else {
        const tokenizedImbalanced = data.imbalancedCase.split(',');
        if (tokenizedImbalanced.length === 1) setFormError('imbalancedCase', { type: 'required', message: t('features.experiment.form.errors.imbalancedCaseInvalidLength') as string });
        const sum = tokenizedImbalanced.reduce((tot: number, curr: string) => tot + parseFloat(curr), 0);
        if (sum != 1.0) setFormError('imbalancedCase', { type: 'required', message: t('features.experiment.form.errors.imbalancedCaseSumDistinctOfOne') as string });
      }
    }
    if (Validations.isBlank(data.name)) setFormError('name', { type: 'required', message: t('features.experiment.form.errors.nameRequired') as string })
    console.log('is form valid', valid, ', evalued data', data);
    return valid;
  }

  const formSubmit = (data: any, event: any) => {
    const buttonName = event.nativeEvent.submitter.name;
    
    if (!validateForm(data, buttonName)) {
      return false;
    }

    const checkedData = {
      ...data,
      special_colnames: JSON.stringify({
        "Case": "Case",
        "Activity": "Activity",
        "Screenshot": "Screenshot",
        "Variant": "Variant"
      }),
      screenshot_name_generation_function: "screenshot_name_without_root_path",
      public: false
    }

    if (buttonName === "generate") {
      checkedData.execute_mode = true;
    } else if (buttonName === "scenarioVariability" || buttonName === "caseVariability") {
      checkedData.status = "PRE_SAVED";
      checkedData.variability_mode = buttonName;
    }

    // delete checkedData.seedLog;

    if (data.logSize != null && data.logSize != "" && data.imbalancedCase != null && data.imbalancedCase != "") {
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

    if (checkedData.screenshots.length === 0 && initialValues.screenshotsPath != null) {
      checkedData.screenshots_path = initialValues.screenshotsPath;
    }
    
    const formData = objectToFormData(checkedData, fileContents);
    onSubmit(formData)
  }

  return (
    <RelativeContainer>
      <Card
        style={{ marginTop: theme.spacing(4) }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(formSubmit)}
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
                inputProps={
                  register('name', {
                    // required: t('features.experiment.form.errors.nameRequired') as string,
                    value: initialValues.name
                  })
                }
                error={formState.errors.name != null}
                helperText={formState.errors.name?.message}
                disabled={ disabled }
              />
            </TextInputContainer>
          </FormInput>

          <FormInput
            title="features.experiment.form.description.label"
            helperText="features.experiment.form.description.helperText"
            style={{ marginTop: theme.spacing(2) }}
          >
            <TextInputContainer>
              <TextField
                fullWidth
                placeholder={t('features.experiment.form.description.placeholder')}
                defaultValue=""
                inputProps={
                  register('description', {
                    // required: t('features.experiment.form.errors.descriptionRequired') as string,
                    value: initialValues.description
                  })
                }
                error={formState.errors.description != null}
                helperText={formState.errors.description?.message}
                disabled={ disabled }
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
              disabled={ disabled }
              errorMessage={!formState.dirtyFields.seedLog && formState.errors?.seedLog?.message}
              fileName={(getValues('seedLog') ?? [])[0]?.name}
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
              disabled={ disabled }
              errorMessage={!formState.dirtyFields.screenshots && formState.errors?.screenshots?.message}
              fileName={(getValues('screenshots') ?? [])[0]?.name || initialValues.screenshotsPath}
              inputProps={{
                  ...screenshotsField,
                  onChange: (evt: any) => {
                    screenshotsField.onChange(evt);
                    forceUpdate();
                  },
              }}
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
                disabled={ disabled }
                type="number"
                placeholder={t('features.experiment.form.scenariosNumber.placeholder')}
                inputProps={
                  register('number_scenarios', {
                    // required: t('features.experiment.form.errors.scenariosNumberRequired') as string,
                    value: initialValues.numberScenarios || 0
                  })
                }
                error={formState.errors.number_scenarios != null}
                helperText={formState.errors.number_scenarios?.message}
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
              disabled={ disabled || scenariosConfDisabled }
              errorMessage={!formState.dirtyFields.scenarios_conf && formState.errors?.scenarios_conf?.message}
              fileName={(getValues('scenarios_conf') ?? [])[0]?.name || (watchNumberScenarios > 0 && initialValues.scenariosConf != null ? 'scenarios_conf.json' : '')}
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
            <Button
              type="submit" name="scenarioVariability"
              disabled={ disabled || scenariosConfDisabled || wizzardDisabled }
              variant="outlined"
              style={{ fontSize: "small", marginLeft: 4 }}
              endIcon={<SettingsSuggestIcon />}>{t('features.experiment.form.assistant')}</Button>
          </FormInput>

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
                    // required: t('features.experiment.form.errors.logSizeRequired') as string,
                    value: initialValues?.sizeBalance?.size_secuence.join(',')
                  })
                }
                disabled={ disabled }
                error={formState.errors.logSize != null}
                helperText={formState.errors.logSize?.message}
              />
            </TextInputContainer>
          </FormInput>

          <FormInput
            title="features.experiment.form.imbalancedCase.label"
            helperText="features.experiment.form.imbalancedCase.helperText"
            tooltip="features.experiment.form.imbalancedCase.tooltip"
            style={{ marginTop: theme.spacing(2) }}
          >
            <TextInputContainer>
              <TextField
                fullWidth
                defaultValue=""
                placeholder={t('features.experiment.form.imbalancedCase.placeholder')}
                inputProps={
                  register('imbalancedCase', {
                    // required: t('features.experiment.form.errors.imbalancedCaseRequired') as string,
                    value: initialValues?.sizeBalance?.balance.Imbalanced.join(',')
                  })
                }
                error={formState.errors.imbalancedCase != null}
                helperText={formState.errors.imbalancedCase?.message}
                disabled={ disabled }
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
              disabled={ disabled }
              errorMessage={!formState.dirtyFields.variability_conf && formState.errors?.variability_conf?.message}
              fileName={(getValues('variability_conf') ?? [])[0]?.name || (initialValues.variabilityConf != null ? 'variability_conf.json' : '')}
              inputProps={{
                ...variabilityField,
                onChange: (evt: any) => {
                  variabilityField.onChange(evt);
                  const file = evt.target.files[0];
                  readFileContent(file)
                    .then((content: string) => {
                      setFileContents({
                        ...fileContents,
                        variability_conf: JSON.stringify(JSON.parse(content)),
                      });
                    })
                    .catch((err) => {
                      console.error('error reading file', err);
                      setError('seedLog', err);
                    })
                }
              }}
            />
            <Button
              type="submit" name="caseVariability"
              disabled={ disabled || wizzardDisabled }
              variant="outlined"
              style={{ fontSize: "small", marginLeft: 4 }}
              endIcon={<SettingsSuggestIcon />}
            >
              {t('features.experiment.form.assistant')}
            </Button>
          </FormInput>
        </CardContent>

        <CardActions>
          <Spacer />

          <Button type="submit" name="save" variant="contained" color="primary" endIcon={<SaveIcon />} disabled={ disabled }>
            {t('features.experiment.form.save')}
          </Button>

          <Button type="submit" name="generate" variant="contained" color="primary" endIcon={<SendIcon />} disabled={ disabled }>
            {t('features.experiment.form.generate')}
          </Button>
        </CardActions>
      </Card>
    </RelativeContainer>
  )
}

export default ExperimentFormComponent;