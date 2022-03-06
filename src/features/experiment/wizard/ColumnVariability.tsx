import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
import { wizardSelector } from 'features/experiment/wizard/slice';
import Checkbox from '@mui/material/Checkbox';

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

const ColumnVariability: React.FC<ExperimentFormProperties> = ({ onSubmit, disabled = false, initialValues = {}}) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const { variant } = useParams<{ variant: string }>();
  const { act } = useParams<{ act: string }>();
  const { seed } = useSelector(experimentsSelector);
  const json_conf = seed;

  return (
    <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
          <TableRow>
            <TableCell align="center">{t("features.wizard.columnVariability.columnName")}</TableCell>
            <TableCell>{t("features.wizard.columnVariability.variate")}</TableCell>
            <TableCell>{t("features.wizard.columnVariability.variabilityFunction")}</TableCell>
            <TableCell>{t("features.wizard.columnVariability.variabilityParams")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          Object.entries(json_conf[variant][act]).map(entry => {
            const aux1 = entry[0];
            const aux2: any = entry[1];
            // const value: ColumnConf = entry[1];
            return (
            <TableRow
              key={`${variant}-${act}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                  <TableCell align="center">
                    {entry[0]}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      aria-label={`${variant}-${act}-${entry[0]}`}
                      // onClick={(event) => updateJsonConf(variant, act, event)}
                      defaultChecked />
                  </TableCell>
                  <TableCell>
                      { entry[0] === "Screenshot"? '' : `Function` }
                  </TableCell>
                  <TableCell>
                      { entry[0] === "Screenshot"?
                      <Button
                        variant="contained"
                        component={RouterLink}
                        to={`/get-gui-component-coordinates/${variant}/${act}/${aux2.initValue}`}
                        >
                        {t("features.wizard.columnVariability.screenshotVariability")}
                      </Button> : `Params`
                      }
                  </TableCell>
              </TableRow>
        )})}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ColumnVariability;