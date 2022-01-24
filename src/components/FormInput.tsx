import React, { FormEventHandler } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/system';

export interface FormInputProps {
  title?: string
  helperText?: string
  style?: React.CSSProperties
  titleAlignment?: string
}

const HelperText = styled(Typography)<TypographyProps<'small', {}>>(({theme}) => ({
  display: 'block',
  marginTop: theme.spacing(1), 
  color: theme.palette.text.secondary,
  '&.error': {
    color: theme.palette.error.main
  }
}));

const FormInput: React.FC<FormInputProps> = ({ title, helperText, style, children, titleAlignment = 'center' }) => {
  const { t } = useTranslation();
  return (
    <Grid container alignItems={ titleAlignment } style={ style }>
      { title && (
        <Grid item xs={ 12 } md={ 5 }>
          { t(title) }
          { helperText && (
            <HelperText variant="caption">
              { t(helperText) }
            </HelperText>
          )}
        </Grid>
      )}
      <Grid item xs={ 12 } md={ 7 }>
        { children }
      </Grid>
    </Grid>
  )
}

export default FormInput;