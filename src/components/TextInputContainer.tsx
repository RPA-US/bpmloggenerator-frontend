import React from 'react';
import { styled } from '@mui/material';

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

export default TextInputContainer;