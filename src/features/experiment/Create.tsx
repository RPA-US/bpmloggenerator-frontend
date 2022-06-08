import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import configuration from "infrastructure/util/configuration";
import BackButton from 'components/BackButton';
import ExperimentFormComponent from './Form';
import { experimentsSelector, saveExperiment} from './slice';

const CreateExperiment: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [ loading, setLoading ] = useState(false)
  const dispatch = useDispatch();
 
  return (
    <>
      <Typography variant="h5">
        <BackButton to={`${configuration.PREFIX}/`} />
        { t('features.experiment.create.title') }
      </Typography>

      <ExperimentFormComponent
        onSubmit={(data: any) => {
          setLoading(true)
          const variability_mode = data.get('variability_mode');
          data.delete('variability_mode');
          dispatch(saveExperiment(data, (status: string, error: any) => {
            setLoading(false);
            if(error != null){
              // alert('unexpected error occurred');
              console.error(error);
            } else {
              if(variability_mode === "scenarioVariability"){
                history.push(configuration.PREFIX+'/scenario-variability');
              } else if (variability_mode === "caseVariability") {
                history.push(configuration.PREFIX+'/case-variability');
              } else {
                history.push(configuration.PREFIX+'/');
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