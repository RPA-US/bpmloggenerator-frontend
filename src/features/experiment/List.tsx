import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { experimentsSelector, loadExperiments } from 'features/experiment/slice';
import { Link as RouterLink } from 'react-router-dom';

import { Button, Card, CardActions, CardContent, CircularProgress, Grid, LinearProgress, Theme, Typography } from '@mui/material';
import { ThemeContext } from '@emotion/react';import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';
import Spacer from 'components/Spacer';
import { styled } from '@mui/system';

import { authSelector } from 'features/auth/slice';
import { repository } from './slice';
import { ExperimentState } from './types';


const FlexDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4)
}))

const downloadResults = async (experimentId: number, token: string) => {
  // http://127.0.0.1:8000/api/v1/experiments/download/5/
  const response = await repository.download(experimentId, token);

}

const ExperimentsList: React.FC = () => {
  const { isLoading, pagination, experiments, error } = useSelector(experimentsSelector);
  const { token } = useSelector(authSelector);
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext) as Theme;
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
          to="/add-experiment"
        >{ t('features.experiment.list.add') }</Button>
      </FlexDiv>
      <Grid container spacing={ 4 }>
        { experiments.length
            ? (experiments.map(((experiment, i) => (
              <Grid key={i} item xs={ 12 } sm={ 6 } lg={ 4 }>
                <Card>
                  <CardContent>
                    <Button color='primary' variant="text" to={`/experiment/${experiment.id}`} component={RouterLink}>
                      <Typography variant='h6'>{ experiment.name }</Typography>
                    </Button>
                    <br />
                    <Typography variant="caption" color="gray" style={{ paddingLeft: theme.spacing(1) }}>
                    { t('commons:datetime', { val: experiment.launchDate }) }
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {
                      experiment.state === ExperimentState.CREATED && (<>
                        <Spacer />
                        <Button color="secondary" startIcon={ <DownloadIcon /> } onClick={ () => downloadResults(experiment.id, token || '') }>{ t('features.experiment.list.downloadResults') }</Button>
                       </>)
                    }
                    {
                      experiment.state === ExperimentState.CREATING && (<LinearProgress color="secondary" />)
                    }
                  </CardActions>
                </Card>
              </Grid>
            ))))
            : ( !isLoading && (<Grid item xs={ 12 }>{ t('features.experiment.list.empty') }</Grid>))
        }

        <Grid container justifyContent="center" style={{ marginTop: theme.spacing(3) }}>
          { isLoading 
            ? (<CircularProgress color="secondary" />) 
            : (experiments.length && pagination.hasNext && (
                <Button variant="contained" color="secondary" onClick={ () => dispatch(loadExperiments()) }>
                  { t('features.experiment.list.viewMore') }
                </Button>
            ))
          }
        </Grid>
      </Grid>
    </>
  )
}

export default ExperimentsList;