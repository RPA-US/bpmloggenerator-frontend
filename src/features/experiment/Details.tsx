import React, { SetStateAction, useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardActions, Button, Grid, Theme, Typography, CircularProgress, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';

import { useHistory, useParams } from 'react-router-dom';
import { ThemeContext, useTheme } from '@emotion/react';
import { authSelector } from 'features/auth/slice';

import BackButton from 'components/BackButton';
import { experimentsSelector, addExperiment, saveExperiment, repository, experimentDTOToExperimentType,  } from './slice';
import ExperimentFormComponent from './Form';
import { ExperimentState } from './types';
import { downloadFile } from './utils';
import Spacer from 'components/Spacer';

const downloadResults = async (experimentId: number, token: string) => {
  try {
    const { filename, blob }: any = await repository.download(experimentId, token);
    downloadFile(filename, blob);    
  } catch (ex) {
    console.error('error downloading experiment result', ex);
  }
}

const ExperimentDetails: React.FC = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { experiments } = useSelector(experimentsSelector);
  const { token } = useSelector(authSelector);
  const { id } = useParams<{ id: string }>();
  const [ experiment, setExperiment ]:any = useState(null);
  const [ loading, setLoading ]:any = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  
  useEffect(() => {
    (async () => {
      try {
        const idParam = parseInt(id, 10);
        setLoading(true)
        setExperiment(null);
        let experimentDetail = experiments.find((exp) => exp.id === idParam);
        if (experimentDetail == null) {
          const response = await repository.get(idParam, token ?? '');
          experimentDetail = experimentDTOToExperimentType(response);
          dispatch(addExperiment)
        }
        setExperiment(experimentDetail);
      } catch (ex) {
        console.error('error getting experiment detail', ex);
      } finally {
        setLoading(false)
      }
    })();
  }, [id]);

  return (
    <>
      <Typography variant="h4">
        <BackButton to="/" />
        { t('features.experiment.details.title') }
      </Typography>

      {
        loading && (
          <Grid container>
            <Grid item>
              <CircularProgress color="secondary" />
            </Grid>
          </Grid>
        )
      }

      { experiment != null && experiment.state === ExperimentState.NOT_LAUNCHED && (
        <ExperimentFormComponent
          onSubmit={(data: any) => {
            console.log('Edit component data received:', data);
            dispatch(saveExperiment({
              id,
              ...data,
            }, () => {
              history.push('/')
            }));
          }}
        />
      )}

      { experiment != null && experiment.state !== ExperimentState.NOT_LAUNCHED && (
        <Card style={{ marginTop: theme.spacing(4)}}>
          <CardContent>
            Name: { experiment.name }
            <br />
          </CardContent>

          <CardActions>
            { experiment.state === ExperimentState.CREATING && (
              <>
                <Typography variant="body1">{ t('features.experiment.creating') }</Typography>
                <LinearProgress color="secondary" />
              </>
            )}
            { experiment.state === ExperimentState.CREATED && (
              <>
                <Spacer />
                <Button color="secondary" startIcon={ <DownloadIcon /> } onClick={ () => downloadResults(experiment.id, token || '') }>{ t('features.experiment.list.downloadResults') }</Button>
              </>
            )}            
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default ExperimentDetails;