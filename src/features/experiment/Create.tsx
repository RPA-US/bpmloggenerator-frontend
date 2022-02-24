import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import BackButton from 'components/BackButton';
import ExperimentFormComponent from './Form';
import { experimentsSelector, saveExperiment } from './slice';

const CreateExperiment: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { experiments } = useSelector(experimentsSelector);
  const [ loading, setLoading ] = useState(false)
  const dispatch = useDispatch();
 
  return (
    <>
      <Typography variant="h4">
        <BackButton to="/" />
        { t('features.experiment.create.title') }
      </Typography>

      <ExperimentFormComponent
        onSubmit={(data: any) => {
          console.log('Create component data received:', data);
          setLoading(true)
          dispatch(saveExperiment(data, (error: any) => {
            setLoading(false)
            error == null && history.push('/')
          }));
        }}
        disabled={ loading }
      />
    </>
  )
}

export default CreateExperiment;