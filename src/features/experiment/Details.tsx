import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardActions, Button, Grid, Theme, Typography, CircularProgress, LinearProgress, Chip, Box, styled, Fab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { useHistory, useParams } from 'react-router-dom';
import { ThemeContext } from '@emotion/react';
import { authSelector } from 'features/auth/slice';

import BackButton from 'components/BackButton';
import { experimentsSelector, addExperiment, saveExperiment, experimentRepository } from './slice';
import { experimentDTOToExperimentType } from './utils';
import ExperimentFormComponent from './Form';
import { ExperimentState } from './types';
import { downloadFile } from './utils';
import Spacer from 'components/Spacer';

const downloadResults = async (experimentId: number, token: string) => {
  try {
    const { filename, blob }: any = await experimentRepository.download(experimentId, token);
    downloadFile(filename, blob);    
  } catch (ex) {
    console.error('error downloading experiment result', ex);
  }
}

const downloadJson = (filename: string, json: any) => {
  const strJson = JSON.stringify(json, null, 2)
  downloadFile(filename, new Blob([strJson], {type: "application/json"}));
}

const BoldKey = styled(Typography)`
  font-weight: bold;
`

const FileBox = styled(Box)`
  border: 1px dashed grey;
`

const ChipProperty = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(2),
  marginTop: theme.spacing(2),
  fontWeight: 500
}))

const ExperimentDetails: React.FC = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { experiments } = useSelector(experimentsSelector);
  const { token } = useSelector(authSelector);
  const { id } = useParams<{ id: string }>();
  const [ experiment, setExperimentInList ]:any = useState(null);
  const [ loading, setLoading ]:any = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  
  useEffect(() => {
    (async () => {
      try {
        const idParam = parseInt(id, 10);
        setLoading(true)
        setExperimentInList(null);
        let experimentDetail = experiments.find((exp) => exp.id === idParam);
        if (experimentDetail == null) {
          const response = await experimentRepository.get(idParam, token ?? '');
          experimentDetail = experimentDTOToExperimentType(response);
          dispatch(addExperiment)
        }
        setExperimentInList(experimentDetail);
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
          initialValues={ experiment }
          onSubmit={(data: any) => {
            console.log('Edit component data received:', data);
            data.set('id', id);
            dispatch(saveExperiment(data,(status: string, error: any) => {
              setLoading(false);
              if(error == null){
                if(status === "PRE_SAVED"){
                  history.push('/case-variability');
                } else {
                  history.push('/');
                }
              } else {
                alert('unexpected error occurred');
                console.error(error);
              }
            }));
          }}
        />
      )}

      { experiment != null && experiment.state !== ExperimentState.NOT_LAUNCHED && (
        <Card style={{ marginTop: theme.spacing(4)}}>
          <CardContent>
            <Typography variant="h6">{ experiment.name }</Typography>
            <Box>
              { experiment.creationDate != null && (
                <Typography variant="caption" sx={{ display: 'inline' }}>
                  { t('features.experiment.details.createdAt', { val: experiment.creationDate }) }
                  { experiment.lastEditionDate != null ? ',' : '' }
                </Typography>
              ) }
              { experiment.lastEditionDate != null && (
                <Typography variant="caption" sx={{ display: 'inline', ml: 1 }}>
                    { t('features.experiment.details.modifiedAt', { val: experiment.lastEditionDate }) }
                </Typography>
              ) }
            </Box>

            <ChipProperty
              color="primary"
              label={ t('features.experiment.details.scenariosNumber', { val: experiment.numberScenarios }) as string }
            />
            
            <ChipProperty
              color="primary"
              label={ t('features.experiment.details.state', { val: ExperimentState[experiment.state] }) as string }
            />            
            
            <ChipProperty
              color="primary"
              label={ t('features.experiment.details.screenshotNameGenerationFunction', { val: experiment.screenshotNameGenerationFunction }) as string }
            />            

            <Grid container spacing={ 3 }>
              <Grid item style={{ marginTop: theme.spacing(3) }}>
                <BoldKey variant="body1">{ t('features.experiment.details.executionStart') }</BoldKey>{ t('commons:datetime', { val: experiment.executionStart }) }
              </Grid>
              <Grid item style={{ marginTop: theme.spacing(3) }}>
                <BoldKey variant="body1">{ t('features.experiment.details.executionEnd') }</BoldKey>{ t('commons:datetime', { val: experiment.executionEnd }) }
              </Grid>
            </Grid>
            
            <Typography variant="subtitle2" style={{ marginTop: theme.spacing(2) }}>{ t('features.experiment.details.description') }</Typography>
            { experiment.description != null && 
              (<Typography variant="body1" 
                style={{
                  marginTop: theme.spacing(1),
                  padding: theme.spacing(2),
                  backgroundColor: theme.palette.grey['200'] 
                }}>
                  { experiment.description ?? t('features.experiment.details.noDescription') }
                </Typography>) 
            }

            { /*<Grid container spacing={ 3 }>
              <Grid item> 
              { t('features.experiment.details.sizeBalance') }
              </Grid>
            </Grid>*/
            }
            
            <Grid container spacing={ 3 } style={{ marginTop: theme.spacing(1) }}>
              { (experiment.numberScenarios ?? 0) > 0  && 
                (<Grid item style={{ marginTop: theme.spacing(1) }}>
                  <FileBox component="span" sx={{ p: 2 }}>
                    <Button
                      startIcon={ <AttachFileIcon /> }
                      onClick={ () => downloadJson('scenarios_conf.json', experiment.scenariosConf)}
                    >{ t('features.experiment.details.scenarios') }</Button>
                  </FileBox>
                </Grid>)
              }
              <Grid item style={{ marginTop: theme.spacing(1) }}>
                <FileBox component="span" sx={{ p: 2 }}>
                  <Button
                    startIcon={ <AttachFileIcon /> }
                    onClick={ () => downloadJson('variability_conf.json', experiment.variabilityConf)}
                  >{ t('features.experiment.details.variabilityConf') }</Button>
                </FileBox>
              </Grid>
              { /*<Grid item style={{ marginTop: theme.spacing(1) }}>
                <FileBox component="span" sx={{ p: 2 }}>
                  <Button
                    startIcon={ <AttachFileIcon /> }
                  >{ t('features.experiment.details.screenshots') }</Button>
                </FileBox>              
            </Grid>*/ }
            </Grid>

          </CardContent>

          <CardActions style={{ padding: theme.spacing(2) }}>
            { experiment.state === ExperimentState.CREATING && (
              <>
                <Typography variant="body1">{ t('features.experiment.creating') }</Typography>
                <LinearProgress color="secondary" />
              </>
            )}
            { experiment.state === ExperimentState.CREATED && (
              <>
                <Fab
                  variant="extended"
                  color="secondary"
                  onClick={ () => downloadResults(experiment.id, token ?? '') }
                >
                  <DownloadIcon sx={{ mr: 1 }} />
                  { t('features.experiment.list.downloadResults') }
                </Fab>
              </>
            )}            
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default ExperimentDetails;