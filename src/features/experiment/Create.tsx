import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import ExperimentFormComponent from './Form';
import { experimentsSelector, createExperiment } from './slice';

const CreateExperiment: React.FC = () => {
  const { t } = useTranslation();
  const { pagination, experiments, error } = useSelector(experimentsSelector);
  const dispatch = useDispatch();
  
  return (
    <>
      <Typography variant="h4">
        { t('features.experiment.create.title') }
      </Typography>

      <ExperimentFormComponent
        onSubmit={(data: any) => {
          console.log('Create component data received:', data);
          dispatch(createExperiment(data));
        }}
      />
    </>
  )
}

export default CreateExperiment;