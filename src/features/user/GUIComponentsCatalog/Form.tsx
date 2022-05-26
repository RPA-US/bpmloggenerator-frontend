import React, { useContext } from 'react';
import { Button, FormHelperText, Grid, MenuItem, Select, TextField, Theme } from '@mui/material';
import { ThemeContext } from '@mui/styled-engine';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import { ErrorOption, useForm } from 'react-hook-form';

import FormInput from 'components/FormInput';
import TextInputContainer from 'components/TextInputContainer';
import FileUpload from 'components/FileUpload';
import Validations from 'infrastructure/util/validations';
import { objectToFormData } from 'infrastructure/util/form';
import Spacer from 'components/Spacer';

import { GUIComponentCategoryType, GUIComponentType } from './types';
import GUIComponentRepository from 'infrastructure/repositories/gui-component';
import { useSelector } from 'react-redux';
import { authSelector } from 'features/auth/slice';

export interface CreateGUIComponentFormProps {
  onSubmit: any
  disabled?: boolean
  initialValues?: any
  categories: GUIComponentCategoryType[]
  repository: GUIComponentRepository
}

const CreateGUIComponentForm: React.FC<CreateGUIComponentFormProps> = ({ onSubmit, disabled = false, initialValues = {}, categories, repository }) => {
  const theme = useContext(ThemeContext) as Theme;
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({} as any), []);
  const { t } = useTranslation();
  const { token } = useSelector(authSelector);
  const { register, formState, handleSubmit, getValues, setValue, setError, clearErrors } = useForm();

  const thumbnailField = register('thumbnail');

  const validateForm = (data: any) => {
    let valid = true;
    const setFormError = (field: string, error: ErrorOption) => {
      valid = false;
      setError(field, error);
    }

    if (Validations.isBlank(data.name)) setFormError('name', { type: 'required', message: t('features.user.gui-components.form.errors.nameRequired') as string });
    if (!Validations.isPositiveInteger(data.category))  setFormError('category', { type: 'required', message: t('features.user.gui-components.form.errors.categoryRequired') as string });
    if (Validations.isBlank(data.id_code)) 
      setFormError('id_code', { type: 'required', message: t('features.user.gui-components.form.errors.idCodeRequired') as string });
    else if (data.id_code.includes(' '))
      setFormError('id_code', { type: 'required', message: t('features.user.gui-components.form.errors.idCodeMustNotContainsWhiteSpace') as string });
    if ((data.thumbnail == null || data.thumbnail.length < 1) && initialValues.filename == null) {
      setFormError('thumbnail', { type: 'required', message: t('features.user.gui-components.form.errors.thumbnailRequired') as string });
    }

    return valid;
  }

  const submit = (data: any) => {
    if (!validateForm(data)) {
      return false;
    }

    const formData = objectToFormData(data, {});

    formData.set('image', formData.get('thumbnail') ?? '');
    formData.delete('thumbnail');

    // formData.set('gui_component_category', JSON.stringify({ id: parseInt(categoryId) }));
    formData.set('gui_component_category', formData.get('category') ?? '');
    formData.delete('category');

    onSubmit(formData);
  }

  return (
    <form noValidate autoComplete="off" onSubmit={ handleSubmit(submit) }>
      <FormInput
        title="features.user.gui-components.form.name.label"
        style={{ marginTop: theme.spacing(2) }}
      >
        <TextInputContainer>
          <TextField
            fullWidth
            placeholder={t('features.user.gui-components.form.name.placeholder')}
            inputProps={
              register('name', {
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
        title="features.user.gui-components.form.idCode.label"
        style={{ marginTop: theme.spacing(2) }}
      >
        <TextInputContainer>
          <TextField
            fullWidth
            placeholder={t('features.user.gui-components.form.idCode.placeholder')}
            inputProps={
              register('id_code', {
                value: initialValues.idCode,
                validate: async(value) => {
                  const existsResponse = await repository.checkIdCode(value, token ?? '');
                  console.log('validate id_code', value, 'exists', existsResponse);
                  return !existsResponse.exists || t('features.user.gui-components.form.errors.idCodeMustBeUnique') as string;
                }
              })
            }
            error={formState.errors.id_code != null}
            helperText={formState.errors.id_code?.message}
            disabled={ initialValues.id_code != null || disabled }
          />
        </TextInputContainer>
      </FormInput>

      <FormInput
        title="features.user.gui-components.form.description.label"
        style={{ marginTop: theme.spacing(2) }}
      >
        <TextInputContainer>
          <TextField
            fullWidth
            placeholder={t('features.user.gui-components.form.description.placeholder')}
            inputProps={
              register('description', {
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
        title="features.user.gui-components.form.category.label"
        style={{ marginTop: theme.spacing(2) }}
      >
        <Select
          disabled={ disabled || categories.length === 0 }
          error={formState.errors.category != null}
          value={ (getValues('category') || initialValues.category) ?? '' }
          onChange={ (evt) => {
            setValue('category', evt.target.value, { shouldValidate: true });
            clearErrors('category');
            forceUpdate();
          }}
          style={{ width: '100%', maxWidth: '400px', marginRight: theme.spacing(4) }}
        >
          { categories.length > 0 && categories.map((category, i) => (
            <MenuItem 
              key={i}
              value={ category.id }
            >{ category.name }</MenuItem>
          )) }
        </Select>
        { formState.errors.category != null && (
          <FormHelperText>{ formState.errors.category?.message }</FormHelperText>
        )}
      </FormInput>

      <FormInput
        title="features.user.gui-components.form.thumbnail.label"
        style={{ marginTop: theme.spacing(2) }}
      >
        <FileUpload
          accept="image/*"
          disabled={ disabled }
          errorMessage={!formState.dirtyFields.thumbnail && formState.errors?.thumbnail?.message}
          fileName={(getValues('thumbnail') ?? [])[0]?.name || initialValues.filename}
          inputProps={{
            ...thumbnailField,
            onChange: (evt: any) => {
              thumbnailField.onChange(evt);
              forceUpdate();
            }
          }}
        />
      </FormInput>

      <Grid container style={{ marginTop: theme.spacing(4) }}>
        <Spacer />
        <Grid item>
          <Button type="submit" name="save" variant="contained" color="primary" endIcon={<SaveIcon />} disabled={ disabled }>
            {t('features.user.form.save')}
          </Button>
          </Grid>
      </Grid>
    </form>
  )

}

export default CreateGUIComponentForm;