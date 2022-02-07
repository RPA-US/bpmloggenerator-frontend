import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { experimentsSelector, loadExperiments } from 'features/experiment/slice';
import { Link as RouterLink } from 'react-router-dom';

import { Button, Card, CardActions, CardContent, CircularProgress, Grid, Hidden, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Spacer from 'components/Spacer';
import { styled } from '@mui/system';


const FlexDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4)
}))

const ExperimentsList: React.FC = () => {
  const { isLoading, experiments, error } = useSelector(experimentsSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(loadExperiments());
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
          to="/add-experiment"
        >{ t('features.experiment.list.add') }</Button>
      </FlexDiv>
      <Grid container spacing={ 4 }>
      { isLoading 
        ? (<Grid item xs={ 12 } justifyContent="center"><CircularProgress color="secondary" /></Grid>)
        : (
          experiments.length
          ? (experiments.map(((experiment, i) => (
            <Grid key={i} item xs={ 12 } sm={ 6 } lg={ 4 }>
              <Card>
                <CardContent>
                  <Typography variant="h5">{ experiment.name }</Typography>
                  <Typography variant="caption" color="gray">
                  { t('commons:datetime', { val: experiment.launchDate }) }
                  </Typography>
                </CardContent>
                <CardActions>
                  <Spacer />
                  <Button color="secondary">{ t('features.experiment.list.edit') }</Button>
                  <Button color="secondary">{ t('features.experiment.list.downloadResults') }</Button>
                </CardActions>
              </Card>
            </Grid>
          ))))
          : (<Grid item xs={ 12 }>{ t('features.experiment.list.empty') }</Grid>)            
        )
      }
      </Grid>
    </>
  )
}

export default ExperimentsList;