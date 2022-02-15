import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { Theme, Typography } from '@mui/material';
import { ThemeContext } from '@emotion/react';

export interface FileInputProps {
  accept?: string,
  errorMessage?: string
  fileName?: string
  inputProps: React.HTMLProps<HTMLInputElement>
}

const FileInput: React.FC<FileInputProps> = ({ accept, inputProps, fileName, errorMessage }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;

  const { title = 'input.attach', name, multiple = false } = inputProps;
  console.log('props received', inputProps);
  const inputId = `file-input--${name}-file`;
  return (
    <React.Fragment>
      <input
        { ...inputProps }
        accept={ accept }
        className={ `input--${name}`}
        style={{ display: 'none' }}
        multiple={ multiple }
        id={ inputId }
        type="file"
      />
      <label htmlFor={ inputId }>
        <Button
          variant="contained"
          color={ errorMessage ? "error" : "secondary" }
          component="span"
          className={ `input--button-${name}`}
          style={{
            marginRight: theme.spacing(1)
          }}
        >
          { t(title) }
        </Button>
      </label>

      { fileName && (<Typography variant="caption" fontSize={ 14 }>{ fileName }</Typography>) }
      { errorMessage && (<Typography color="error" variant="caption">{ errorMessage }</Typography>) }
      
    </React.Fragment>
  )
}

export default FileInput;