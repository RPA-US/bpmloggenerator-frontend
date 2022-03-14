import React, { useContext, useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, Modal, TextField, Theme, Typography, Grid, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { Link as RouterLink } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { wizardSelector, loadDataAndInitValues, updateJsonConf, updateVariateValue, wizardSlice } from 'features/experiment/wizard/slice';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import NextButton from 'components/NextButton';
import LogForm from './LogForm';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export interface ExperimentFormProperties {
  onSubmit: any
  disabled?: boolean,
  initialValues?: any
}
export interface ColumnConf {
  initValue: any,
  variate: any,
  name: string,
  args: any
}

const ColumnVariability: React.FC = () => {
  const { t } = useTranslation();
  const colorRef = useRef<any>("");
  const sizeRef = useRef<any>(0);
  const theme = useContext(ThemeContext) as Theme;
  const { variant } = useParams<{ variant: string }>();
  const { act } = useParams<{ act: string }>();
  const dispatch = useDispatch();
  // If you want a function to run on mount you use useEffect with an empty dependency array
  const { isLoading } = useSelector(wizardSelector);
  const { seed, functions, params, category_functions, screenshot_functions, initialValues } = useSelector(wizardSelector);
  const history = useHistory();
  useEffect(() => {
    dispatch(loadDataAndInitValues(variant, act, true));
  }, [variant, act])
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
      history.push('/experiment-wizard')
    }
  }
  return (
    <>
      <div>
        <Typography variant="h5">
          {t('features.experiment.create.title')}
          <NextButton to="/experiment-wizard" />
        </Typography>
        {isLoading ?
          (<Grid container justifyContent="center" style={{ marginTop: theme.spacing(3) }}>
            <CircularProgress color="secondary" />
          </Grid>)
          :
          <LogForm />
        }
      </div>
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
    </>
  );
}

export default ColumnVariability;