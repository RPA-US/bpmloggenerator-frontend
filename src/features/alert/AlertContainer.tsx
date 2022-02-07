import React from 'react';
import { styled } from '@mui/system';
import { Alert } from '@mui/material';

const CONTAINER_WIDTH = 400;

const Container = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  right: 0,
  width: `${CONTAINER_WIDTH}px`,
  zIndex: 1,
  padding: theme.spacing(2)
}))

const AlertContainer: React.FC = () => {
  return (
    <>
      <Container>
        <Alert severity="error">This is an error alert — check it out!</Alert>
      </Container>    
    </>
  )
}

export default AlertContainer;