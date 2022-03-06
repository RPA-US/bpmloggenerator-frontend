import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, TextField, Theme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import FormInput from 'components/FormInput';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { ErrorOption, SubmitHandler, useForm, ValidationRule } from 'react-hook-form';
import styled from '@emotion/styled';
import Spacer from 'components/Spacer';
import { Link as RouterLink } from 'react-router-dom';
import Validations from 'infrastructure/util/validations';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { authSelector } from 'features/auth/slice';
import { experimentsSelector } from 'features/experiment/slice';
import { wizardSelector, wizardSlice } from 'features/experiment/wizard/slice';
import Checkbox from '@mui/material/Checkbox';

export interface ExperimentFormProperties {
  onSubmit: any
  disabled?: boolean,
  initialValues?: any
}

const ExperimentAssist: React.FC<ExperimentFormProperties> = ({ onSubmit, disabled = false, initialValues = {}}) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { seed } = useSelector(experimentsSelector);
  const dispatch = useDispatch();
  // const { wizard } = useSelector(wizardSelector);
  const json_conf = { ...seed };
  dispatch(wizardSlice.actions.setVariabilityConfiguration(json_conf));
  


  // const updateJsonConf = (variant: string, act: string, event: any) => {
  //     let aux = 0;
  //     if (event.target.checked) {
  //       aux = 1;
  //     }
  //     Object.keys(json_conf[variant][act]).forEach((column)=>{
  //       // another possible solution could be Immutable
  //       setJSONConfig({
  //         ...json_conf,
  //         [variant]: {
  //           ...json_conf[variant],
  //           [act]:{
  //             ...json_conf[variant][act],
  //             [column]: {
  //               ...json_conf[variant][act][column],
  //               variate: aux
  //             }
  //           }
  //         }
  //       })
  //     });
      
  //     dispatch(wizardSlice.actions.setVariabilityConfiguration(json_conf));
  // }
  
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
              {Object.keys(acts).some(column => acts[column]['variate'] === '1') && (
                  "Variability configured"
              )}

              {!Object.keys(acts).some(column => acts[column]['variate'] === '1') && (
                  "Variability is not configured"
              )}
            </TableCell>
          </TableRow>
      ))};

  return (
    <Paper sx={{ width: '70%', overflow: 'hidden', margin: 'auto' }}>
    <TableContainer sx={{ maxHeight: '100%' }}>
      {
        Object.entries(json_conf).map(entry => (
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
  </Paper>
  );
}

export default ExperimentAssist;