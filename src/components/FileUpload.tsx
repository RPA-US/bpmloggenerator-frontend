import React from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

export interface FileInputProps extends React.HTMLProps<HTMLInputElement> {
}

const FileInput: React.FC<FileInputProps> = ({ name, title = 'input.attach', accept, multiple = false, onChange, onClick }) => {
  const { t } = useTranslation();

  const inputId = `file-input--${name}-file`;
  return (
    <React.Fragment>
      <input
        accept={ accept }
        className={ `input--${name}`}
        style={{ display: 'none' }}
        multiple={ multiple }
        id={ inputId }
        type="file"
        onChange={ onChange }
        onClick={ onClick }
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