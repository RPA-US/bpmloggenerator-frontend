import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { experimentsSelector, experimentStatusChecker, loadExperiments, setExperimentInList } from 'features/experiment/slice';
import { Link as RouterLink } from 'react-router-dom';
import configuration from "infrastructure/util/configuration";
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';

import { authSelector } from 'features/auth/slice';
import { experimentRepository } from './slice';
import { downloadFile } from './utils';
import List from './List';

import { ExperimentState } from './types';
import NotificationFactory from 'features/notifications/notification';
import { showNotification } from 'features/notifications/slice';

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

  useEffect(() => {
    experiments
      .forEach(exp => {
        experimentStatusChecker.checkExperimentStatus(
          exp, 
          (expData: any) => dispatch(setExperimentInList(expData)),
          token ?? '',
          (experiment: any) => {
            const notification = NotificationFactory.success(`Experiment "${experiment.name}" execution completed`, `Click on the notification title to view details`, `${configuration.PREFIX}/experiment/${experiment.id}`)
              .dismissible()
              .build();

            setTimeout(() => {
              dispatch(showNotification(notification));
            }, 0)
          } 
        )
      })

  }, [experiments])

  return (
    <>
      <FlexDiv>
        <Typography variant="h4">
          { t('features.experiment.list.title') }
        </Typography>
        
        <div>
          <Button 
            variant="contained"
            component={ RouterLink }
            to={`${configuration.PREFIX}/public`}
            style={{ marginRight: '24px' }}
          >{ t('features.experiment.list.public') }</Button>
          
          <Button 
            variant="contained"
            component={ RouterLink }
            to={`${configuration.PREFIX}/add-experiment`}
          >{ t('features.experiment.list.add') }</Button>
        </div>
      </FlexDiv>

      <List
        loadMoreFn={ () => loadExperiments() }
        loadMoreDisabled={ experiments.length > 0 && !pagination.hasNext }
        isLoading={ isLoading }
        experiments={ experiments }
        downloadFn = { (id: number) => downloadResults(id, token ?? '') }
      />

    </>
  )
}

export default ExperimentsList;

function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
