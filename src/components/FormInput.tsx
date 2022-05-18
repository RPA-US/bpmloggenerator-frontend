import React, { FormEventHandler } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Tooltip, Typography, TypographyProps } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/system';

export interface FormInputProps {
  title?: string
  helperText?: string
  style?: React.CSSProperties
  titleAlignment?: string
  tooltip?: string
  labelGridValue?: number,
  valueGridValue?: number,
}

const HelperText = styled(Typography)<TypographyProps<'small', {}>>(({theme}) => ({
  display: 'block',
  marginTop: theme.spacing(1), 
  color: theme.palette.text.secondary,
  '&.error': {
    color: theme.palette.error.main
  }
}));

const FormInput: React.FC<FormInputProps> = ({ title, helperText, tooltip, style, children, titleAlignment = 'center', labelGridValue, valueGridValue }) => {
  const { t } = useTranslation();

  return (
    <Grid container alignItems={ titleAlignment } style={ style }>
      { title && (
        <Grid item xs={ 12 } md={ labelGridValue ?? 5 }>
          { typeof tooltip === 'string' && (
            <Tooltip title={ t(tooltip) as string }  >
                <InfoIcon style={{ fontSize: 16, marginRight: 4 }} />
            </Tooltip>
          ) }
          { t(title) }
          { helperText && (
            <HelperText variant="caption">
              { t(helperText) }
            </HelperText>
          )}
        </Grid>
      )}
      <Grid item xs={ 12 } md={ valueGridValue ?? 7 }>
        { children }
      </Grid>
    </Grid>
  )
}

export default FormInput;