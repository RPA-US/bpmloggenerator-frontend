import React from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

export interface FileInputProps extends React.HTMLProps<HTMLInputElement> {
  inputRef?: any,
}

const FileInput: React.FC<FileInputProps> = ({ inputRef, ...inputProps }) => {
  const { t } = useTranslation();

  const { accept, title = 'input.attach', name, multiple = false } = inputProps;

  const inputId = `file-input--${name}-file`;
  return (
    <React.Fragment>
      <input
        { ...inputProps }
        ref={ inputRef }
        accept={ accept }
        className={ `input--${name}`}
        style={{ display: 'none' }}
        multiple={ multiple }
        id={ inputId }
        type="file"
      />
      <label htmlFor={ inputId }>
        <Button variant="contained" color="secondary" component="span" className={ `input--button-${name}` }>
          { t(title) }
        </Button>
      </label> 
    </React.Fragment>
  )
}

export default FileInput;