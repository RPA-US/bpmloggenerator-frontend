import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import ExperimentFormComponent from './Form';
import { experimentsSelector, createExperiment } from './slice';

const CreateExperiment: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { experiments } = useSelector(experimentsSelector);
  const [ experimentsNumber, setExperimentsNumber ] = useState(experiments.length);
  const dispatch = useDispatch();
 
  useEffect(() => {
    if (experiments.length > experimentsNumber) {
      history.push('/')
    } else {
      setExperimentsNumber(experiments.length);
    }
  }, [ experiments ])

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