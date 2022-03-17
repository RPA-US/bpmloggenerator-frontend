import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import BackButton from 'components/BackButton';
import ExperimentFormComponent from './Form';
import { experimentsSelector, saveExperiment} from './slice';

const CreateExperiment: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { experiments } = useSelector(experimentsSelector);
  const [ loading, setLoading ] = useState(false)
  const dispatch = useDispatch();
 
  return (
    <>
      <Typography variant="h5">
        <BackButton to="/" />
        { t('features.experiment.create.title') }
      </Typography>

      <ExperimentFormComponent
        onSubmit={(data: any) => {
          setLoading(true)
          console.log('Create component data received:', data);
          const variability_mode = data.get('variability_mode');
          data.delete('variability_mode');
          dispatch(saveExperiment(data, (status: string, error: any) => {
            setLoading(false);
            if(error != null){
              alert('unexpected error occurred');
              console.error(error);
            } else {
              if(variability_mode === "scenarioVariability"){
                history.push('/scenario-variability');
              } else if (variability_mode === "caseVariability") {
                history.push('/case-variability');
              } else {
                history.push('/');
              }
            }
          }));
        }}
        disabled={ loading }
      />
    </>
  )
}

export default CreateExperiment;