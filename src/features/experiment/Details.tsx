import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardActions, Button, Grid, Theme, Typography, CircularProgress, LinearProgress, Chip, Box, styled, Fab, Switch, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LinkIcon from '@mui/icons-material/Link';
import configuration from "infrastructure/util/configuration";
import { useHistory, useParams } from 'react-router-dom';
import { ThemeContext } from '@emotion/react';
import { authSelector } from 'features/auth/slice';

import BackButton from 'components/BackButton';
import { experimentsSelector, addExperiment, saveExperiment, experimentRepository, experimentsSlice} from './slice';
import { experimentDTOToExperimentType, downloadFile, copyTextToClipboard, experimentToFormData } from './utils';
import ExperimentFormComponent from './Form';
import { ExperimentState } from './types';
import NotificationFactory from 'features/notifications/notification';
import { showNotification } from 'features/notifications/slice';

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
  downloadFile(filename, new Blob([strJson], { type: "application/json" }));
}

const buildPublicLink = (id: any): string => `${configuration.PUBLIC_LINK_PART}/experiment/${id}`;

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
  const [experiment, setExperimentInList]: any = useState(null);
  const [loading, setLoading]: any = useState(false);
  const [owned, setOwned]: any = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const idParam = parseInt(id, 10);
        setLoading(true)
        setExperimentInList(null);
        // let experimentDetail = experiments.find((exp) => exp.id === idParam);
        // if (experimentDetail == null) {
        const response = await experimentRepository.get(idParam, token ?? '');
        setOwned(response.owned)
        let experimentDetail = experimentDTOToExperimentType(response.experiment);
        dispatch(addExperiment)
        // }
        setExperimentInList(experimentDetail);
      } catch (ex) {
        console.error('error getting experiment detail', ex);
      } finally {
        setLoading(false)
      }
    })();
  }, [id,token]);



  return (
    <>
      <Typography variant="h4">
        <BackButton />
        {t('features.experiment.details.title')}
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

      {experiment != null && experiment.state === ExperimentState.NOT_LAUNCHED && (
        <ExperimentFormComponent
          initialValues={experiment}
          onSubmit={(data: any) => {
            // console.log('Edit component data received:', data);
            const variability_mode = data.get('variability_mode');
            data.set('id', id);
            dispatch(saveExperiment(data, (status: string, error: any) => {
              setLoading(false);
              if (error == null) {
                if (status != "LAUNCHED") {
                  if (variability_mode === "scenarioVariability") {
                    history.push(configuration.PREFIX + '/scenario-variability');
                  } else if (variability_mode === "caseVariability") {
                    history.push(configuration.PREFIX + '/case-variability');
                  } else {
                    const notification = NotificationFactory.success(t('features.experiment.details.experiment') + ` ${experiment.name} ` + t('features.experiment.details.success'))
                      .dismissible()
                      .build();
            
                    setTimeout(() => {
                      dispatch(showNotification(notification));
                    }, 0)
                  }
                } else {
                  history.push(configuration.PREFIX + '/');
                }
              } else {
                const notification = NotificationFactory.error(t('features.experiment.details.experiment') + ` ${experiment.name} ` + error)
                    .dismissible()
                    .build();
          
                  setTimeout(() => {
                    dispatch(showNotification(notification));
                  }, 0)
              
              }
              }));
          }}
        />
      )}

      {experiment != null && experiment.state !== ExperimentState.NOT_LAUNCHED && (
        <Card style={{ marginTop: theme.spacing(4) }}>
          <CardContent>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6">{experiment.name}</Typography>
              </Grid>
              { owned &&
                <Grid item>
                  <label>{t('features.experiment.details.published')}</label>
                  <Switch
                    color="secondary"
                    checked={experiment.isPublic}
                    onChange={() => {
                      const experimentData: any = experimentToFormData(experiment);
                      const newValue = !experiment.isPublic;
                      experimentData.set('public', newValue);
                      console.log('experimentToFormData', [...experimentData.entries()]);
                      dispatch(saveExperiment(experimentData, () => {
                        const notification = NotificationFactory.success(
                            t('features.experiment.details.experiment') + ` ${experiment.name} ` + t('features.experiment.details.success') + ` ${newValue ? t('features.experiment.details.publish') : t('features.experiment.details.unpublish')}`
                          )
                          .dismissible()
                          .build();

                        setTimeout(() => {
                          dispatch(showNotification(notification));
                          setExperimentInList({
                            ...experiment,
                            isPublic: newValue
                          })
                        }, 0)
                      }))
                    }}
                    inputProps={{ 'aria-label': t('features.experiment.details.publish') }}
                  />
                </Grid>
              }
            </Grid>
            <Box>
              {experiment.creationDate != null && (
                <Typography variant="caption" sx={{ display: 'inline' }}>
                  {t('features.experiment.details.createdAt', { val: experiment.creationDate })}
                  {experiment.lastEditionDate != null ? ',' : ''}
                </Typography>
              )}
              {experiment.lastEditionDate != null && (
                <Typography variant="caption" sx={{ display: 'inline', ml: 1 }}>
                  {t('features.experiment.details.modifiedAt', { val: experiment.lastEditionDate })}
                </Typography>
              )}
            </Box>

            <ChipProperty
              color="primary"
              label={t('features.experiment.details.scenariosNumber', { val: experiment.numberScenarios }) as string}
            />

            <ChipProperty
              color="primary"
              label={t('features.experiment.details.state', { val: ExperimentState[experiment.state] }) as string}
            />

            <ChipProperty
              color="primary"
              label={t('features.experiment.details.screenshotNameGenerationFunction', { val: experiment.screenshotNameGenerationFunction }) as string}
            />

            <Grid container spacing={3}>
              <Grid item style={{ marginTop: theme.spacing(3) }}>
                <BoldKey variant="body1">{t('features.experiment.details.executionStart')}</BoldKey>{t('commons:datetime', { val: experiment.executionStart })}
              </Grid>
              <Grid item style={{ marginTop: theme.spacing(3) }}>
                <BoldKey variant="body1">{t('features.experiment.details.executionEnd')}</BoldKey>{t('commons:datetime', { val: experiment.executionEnd })}
              </Grid>
            </Grid>

            <Typography variant="subtitle2" style={{ marginTop: theme.spacing(2) }}>{t('features.experiment.details.description')}</Typography>
            {experiment.description != null &&
              (<Typography variant="body1"
                style={{
                  marginTop: theme.spacing(1),
                  padding: theme.spacing(2),
                  backgroundColor: theme.palette.grey['200']
                }}>
                {experiment.description ?? t('features.experiment.details.noDescription')}
              </Typography>)
            }

            {experiment.isPublic && (
              <Grid container spacing={3} style={{ marginTop: theme.spacing(2) }} alignItems="center">
                {/* <Grid item>
                  <BoldKey variant="body1">{t('features.experiment.details.author')}</BoldKey>
                  {experiment.author}
                </Grid> */}
                <Grid item>
                  <BoldKey variant="body1">{t('features.experiment.details.identifier')}</BoldKey>
                </Grid>
                <Grid item>
                  <Tooltip title={t('features.experiment.details.copyLink') as string}>
                    <Button
                      color="secondary"
                      startIcon={<LinkIcon />}
                      onClick={() => copyTextToClipboard(buildPublicLink(experiment.id))}
                      style={{
                        ...theme.typography.subtitle1,
                        padding: theme.spacing(1),
                        textTransform: 'initial',
                        fontWeight: 'bold',
                        backgroundColor: theme.palette.grey['100'],
                      }}
                    >
                      {buildPublicLink(experiment.id)}
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3} style={{ marginTop: theme.spacing(1) }}>
              {(experiment.numberScenarios ?? 0) > 0 &&
                (<Grid item style={{ marginTop: theme.spacing(1) }}>
                  <FileBox component="span" sx={{ p: 2 }}>
                    <Button
                      startIcon={<AttachFileIcon />}
                      onClick={() => downloadJson('scenarios_conf.json', experiment.scenariosConf)}
                    >{t('features.experiment.details.scenarios')}</Button>
                  </FileBox>
                </Grid>)
              }
              <Grid item style={{ marginTop: theme.spacing(1) }}>
                <FileBox component="span" sx={{ p: 2 }}>
                  <Button
                    startIcon={<AttachFileIcon />}
                    onClick={() => downloadJson('variability_conf.json', experiment.variabilityConf)}
                  >{t('features.experiment.details.variabilityConf')}</Button>
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
            {experiment.state === ExperimentState.CREATING && (
              <>
                <Typography variant="body1">{t('features.experiment.creating')}</Typography>
                <LinearProgress color="secondary" />
              </>
            )}
            {experiment.state === ExperimentState.CREATED && (
              <>
                <Fab
                  variant="extended"
                  color="secondary"
                  onClick={() => downloadResults(experiment.id, token ?? '')}
                >
                  <DownloadIcon sx={{ mr: 1 }} />
                  {t('features.experiment.list.downloadResults')}
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