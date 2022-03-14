import React, { useContext } from 'react';
import { Button, Theme, Typography, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { wizardSelector } from 'features/experiment/wizard/slice';
import { experimentsSelector } from 'features/experiment/slice';
import BackButton from 'components/BackButton';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';

export interface ExperimentFormProperties {
  onSubmit: any
  disabled?: boolean,
  initialValues?: any
}

const ExperimentAssist: React.FC = () => {
  const { t } = useTranslation();
  const { seed } = useSelector(wizardSelector);
  const { detail } = useSelector(experimentsSelector);
  const history = useHistory();
  const theme = useContext(ThemeContext) as Theme;
  
  function downloadFunction(jsonTMP: any, type: string, filename: string) {
    const blob = new Blob([JSON.stringify(jsonTMP)], { type: type })
    const a = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  function handleDownload(e: any) {
    let jsonTMP = seed;
    let typeTMP = "text/json"
    let filenameTMP = "json_variability_configuration.json"
    downloadFunction(jsonTMP, typeTMP, filenameTMP);
  }

  function handleDownloadAndNext(e: any) {
    if (window.confirm(t('features.experiment.assist.download_confirmation'))) {
      let jsonTMP = seed;
      let typeTMP = "text/json"
      let filenameTMP = "json_variability_configuration.json"
      downloadFunction(jsonTMP, typeTMP, filenameTMP);
      history.push('/experiment/'+detail?.id);
    }
  }

  const variantActivities = (entry: any) => {
    let variant = entry[0];
    let acts = entry[1];
    
    return Object.keys(acts).map( act => (
      <TableRow
        key={`${variant}-${act}`}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
            <TableCell align="center">
              <Button
                variant="contained"
                component={RouterLink}
                to={`/column-variability/${variant}/${act}`}
                >
                {t("features.wizard.activitySelection.activity")} {act}
              </Button>
            </TableCell>
            <TableCell>
              {Object.keys(seed[variant][act]).some(column => seed[variant][act][column]['variate'] === 1) && (
                <div>
                    Configured
                    {/* <DoneIcon />Variability configured */}
                  </div>
              )}

              {!Object.keys(seed[variant][act]).some(column => seed[variant][act][column]['variate'] === 1) && (
                  <div>
                    Not configured
                    {/* <CloseIcon /> Variability not configured */}
                  </div>
              )}
            </TableCell>
          </TableRow>
      ))};

  return (
    <div>
      <Typography variant="h5">
          <BackButton to="/add-experiment" />
          { t('features.experiment.create.title') }
      </Typography>
      <Paper sx={{ width: '70%', overflow: 'hidden', margin: 'auto' }}>
      <TableContainer sx={{ maxHeight: '100%' }}>
        {
          Object.entries(seed).map(entry => (
            <Table sx={{ minWidth: 650 }} key={`${entry[0]}`} aria-label="variant activity selection">
            <TableHead>
            <TableRow key="headers">
              <TableCell align="center">{`${t("features.wizard.activitySelection.variant")} ${entry[0]}`}</TableCell>
              <TableCell>{t("features.wizard.activitySelection.variate")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variantActivities(entry)}
          </TableBody>
        </Table>
        ))}
      </TableContainer>
      <Grid
        container
        direction="row-reverse"
        spacing={2}>
        <Grid xs={12} lg={2} item justifyContent="center" style={{ marginTop: theme.spacing(2) }}>
          <Button type="submit" name="generate" variant="contained" color="primary" endIcon={<SendIcon />} onClick={handleDownloadAndNext}>
            {t('features.experiment.assist.download_next')}
          </Button>
        </Grid>
        <Grid xs={12} lg={2} item justifyContent="center" style={{ marginTop: theme.spacing(2)}}>
          <Button type="submit" name="download" variant="contained" color="primary" endIcon={<DownloadIcon />} onClick={handleDownload}>
            {t('features.experiment.assist.download')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  </div>
  );
}

export default ExperimentAssist;