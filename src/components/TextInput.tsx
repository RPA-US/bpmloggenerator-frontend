import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/system';

const maxWidth = 400; // px

const StyledTextField = styled(TextField)`
  width: 100%;
  max-width: ${maxWidth}px;
`

const TextInput: React.FC<TextFieldProps> = (props) => (
  <StyledTextField
    variant="outlined"
    size="small"
    { ...props } 
  />
)

export default TextInput;