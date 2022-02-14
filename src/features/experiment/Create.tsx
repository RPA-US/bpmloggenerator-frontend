import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ExperimentFormComponent from './Form';


const CreateExperiment: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h4">
        { t('features.experiment.create.title') }
      </Typography>

      <ExperimentFormComponent 
        onSubmit={(data: any) => {
          console.log('Create component data received:', data);
        }}
      />
    </>
  )
}

export default CreateExperiment;