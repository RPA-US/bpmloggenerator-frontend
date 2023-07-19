import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import configuration from "infrastructure/util/configuration";
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, LinearProgress, Theme, Typography } from '@mui/material';
import { ThemeContext } from '@emotion/react';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';
import Spacer from 'components/Spacer';

import { Experiment, ExperimentState } from './types';
export interface ListProps {
  experiments: Experiment[],
  loadMoreFn: Function,
  loadMoreDisabled: boolean,
  isLoading: boolean,
  showAuthor: boolean,
  downloadFn: Function,
}

const List: React.FC<ListProps> = ({ experiments, loadMoreFn, loadMoreDisabled, isLoading, showAuthor, downloadFn }) => {
  const theme = useContext(ThemeContext) as Theme;
  const { t } = useTranslation();
  return (
    <>
      <Grid container spacing={ 4 }>
        { experiments.length
            ? (experiments.map(((experiment, i) => (
              <Grid key={i} item xs={ 12 } sm={ 6 } lg={ 4 }>
                <Card style={{ minHeight: 155, position: 'relative' }}>
                  <CardContent>
                    <Button color='primary' variant="text" to={`${configuration.PREFIX}/experiment/${experiment.id}`} component={RouterLink}>
                      <Typography variant='h6'>{ experiment.name }</Typography>
                    </Button>
                    <br />
                    { showAuthor && (
                      <Typography variant="body2" color="black" style={{ paddingLeft: theme.spacing(1) }}>
                        { experiment.author }
                      </Typography>
                    )}
                    <Typography variant="caption" color="gray" style={{ paddingLeft: theme.spacing(1) }}>
                    { t('commons:datetime', { val: experiment.state === ExperimentState.CREATED ? experiment.executionEnd : (experiment.lastEditionDate===new Date())?experiment.lastEditionDate:experiment.creationDate }) }
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {
                      experiment.state === ExperimentState.CREATED && (<>
                        <Spacer />
                        <Button color="secondary" startIcon={ <DownloadIcon /> } onClick={ () => downloadFn(experiment.id) }>{ t('features.experiment.list.downloadResults') }</Button>
                       </>)
                    }
                    {
                      experiment.state === ExperimentState.CREATING && (
                        <Box sx={{ width: '100%', position: 'absolute', bottom: theme.spacing(1), margin: `-${theme.spacing(1)}` }}>
                          <LinearProgress 
                            color="primary" 
                            variant={ experiment.isBeingProcessed >= 0 ? 'determinate' : 'indeterminate' }
                            value={ experiment.isBeingProcessed }
                          />
                        </Box>
                      )
                    }
                  </CardActions>
                </Card>
              </Grid>
            ))))
            : ( !isLoading && (<Grid item xs={ 12 }>{ t('features.experiment.list.empty') }</Grid>))
        }

        <Grid container justifyContent="center" style={{ marginTop: theme.spacing(3), marginBottom: theme.spacing(3) }}>
          { isLoading 
            ? (<CircularProgress color="secondary" />) 
            : (!loadMoreDisabled && (
                <Button variant="contained" color="secondary" onClick={ () => loadMoreFn() }>
                  { t('features.experiment.list.viewMore') }
                </Button>
            ))
          }
        </Grid>
      </Grid>
    </>
  )
}

export default List;