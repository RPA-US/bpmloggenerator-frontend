import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { experimentsSelector, loadExperiments } from 'features/experiment/slice';
import { Link as RouterLink } from 'react-router-dom';

import { Button, Card, CardActions, CardContent, CircularProgress, Grid, Theme, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Spacer from 'components/Spacer';
import { styled } from '@mui/system';
import { ThemeContext } from '@emotion/react';


const FlexDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4)
}))

const onDownload = () => {}


const ExperimentsList: React.FC = () => {
  const { isLoading, pagination, experiments, error } = useSelector(experimentsSelector);
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext) as Theme;
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
        { experiments.length
            ? (experiments.map(((experiment, i) => (
              <Grid key={i} item xs={ 12 } sm={ 6 } lg={ 4 }>
                <Card>
                  <CardContent>
                    <RouterLink to={`/experiment/${experiment.id}`}><Typography variant="h5">{ experiment.name }</Typography></RouterLink>
                    <Typography variant="caption" color="gray">
                    { t('commons:datetime', { val: experiment.launchDate }) }
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Spacer />
                    <Button color="secondary" disabled>{ t('features.experiment.list.edit') }</Button>
                    <Button color="secondary" disabled>{ t('features.experiment.list.downloadResults') }</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))))
            : (<Grid item xs={ 12 }>{ t('features.experiment.list.empty') }</Grid>)
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