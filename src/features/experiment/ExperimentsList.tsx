import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { experimentsSelector, loadExperiments } from 'features/experiment/slice';
import { Link as RouterLink } from 'react-router-dom';
import configuration from "infrastructure/util/configuration";
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';

import { authSelector } from 'features/auth/slice';
import { experimentRepository } from './slice';
import { downloadFile } from './utils';
import List from './List';

const FlexDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4)
}))

const downloadResults = async (experimentId: number, token: string) => {
  try {
    const { filename, blob }: any = await experimentRepository.download(experimentId, token);
    downloadFile(filename, blob);    
  } catch (ex) {
    console.error('error downloading experiment result', ex);
  }
}

const ExperimentsList: React.FC = () => {
  const { isLoading, pagination, experiments, error } = useSelector(experimentsSelector);
  const { token } = useSelector(authSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (experiments.length === 0) {
      dispatch(loadExperiments());
    }
  }, [ dispatch ])

  return (
    <>
      <FlexDiv>
        <Typography variant="h4">
          { t('features.experiment.list.title') }
        </Typography>
        
        <Button 
          variant="contained"
          component={ RouterLink }
          to={`${configuration.PREFIX}/add-experiment`}
        >{ t('features.experiment.list.add') }</Button>
      </FlexDiv>
      
      <List
        loadMoreFn={ () => loadExperiments() }
        loadMoreDisabled={ experiments.length > 0 && pagination.hasNext }
        isLoading={ isLoading }
        experiments={ experiments }
        downloadFn = { (id: number) => downloadResults(id, token ?? '') }
      />
    </>
  )
}

export default ExperimentsList;