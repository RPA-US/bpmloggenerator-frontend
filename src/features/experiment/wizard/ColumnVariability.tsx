import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, TextField, Theme, Typography } from '@mui/material';
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
import { CategoryDTO, FunctionParamDTO, GUIComponentDTO, VariabilityFunctionDTO } from 'infrastructure/http/dto/wizard';
import { authSelector } from 'features/auth/slice';
import { experimentsSelector } from 'features/experiment/slice';
import { wizardSelector, loadFunctionsAndCategories } from 'features/experiment/wizard/slice';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
  const dispatch = useDispatch();
  dispatch(loadFunctionsAndCategories());
  const { seed, functions, params, category_functions, gui_components, category_gui_components } = useSelector(wizardSelector);
  const json_conf = seed;
  const [age, setAge] = React.useState('');
  const [initialFunctions, initialParams] = initialColumnVariabilityValues(seed);
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  function initialColumnVariabilityValues(seed: any) {
    let initialParams = new Map();
    let initialFunctions = new Map();
    Object.entries({...seed[variant][act]}).forEach(entry => {
      const val: any = entry[1]; 
      initialFunctions.set(entry[0], val.name);
      initialParams.set(entry[0], val.args);
    });
    return [initialFunctions, initialParams]
  }


  function paramsByFunction(functionTMP: number) {
    let paramsTMP: FunctionParamDTO[] = [];
    let paramsID = []
    // for (let f of functions) {
    //   if (f.id === functionTMP && f.params.length > 0) {
    //     for (let id2 of params) {
    //       paramsID = f.params.filter(c => { (id2.id===c)?c:""});
    //       if (paramsID.length > 0) {
    //         paramsTMP.push(id2);
    //       }
    //     }
    //   }
    // }
    // setParams([...paramsTMP]);
  }

  function handleChangeFunction(e: any) {
    let functionTMP: number = e.target.value;
    // setFunction(functionTMP);
    paramsByFunction(functionTMP);
  }


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
          Object.entries(json_conf[variant][act]).map( entry => {
            const log_column_name = entry[0];
            const log_column: any = entry[1];
            // const value: ColumnConf = entry[1];
            return (
            <TableRow
              key={`${variant}-${act}-${log_column_name}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                  <TableCell align="center">
                    {log_column_name}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      aria-label={`variate-${variant}-${act}-${log_column_name}`}
                      defaultChecked={ log_column.variate }
                      // onClick={(event) => updateJsonConf(variant, act, event)}
                      />
                  </TableCell>
                  <TableCell>
                      { entry[0] === "Screenshot"? '' : 
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id={`function-${variant}-${act}-${log_column}`}>
                          <Typography component="div" >
                          {t('features.wizard.columnVariability.variability_function_label')}
                          </Typography>
                          </InputLabel>
                          <Select
                            id={`function-${variant}-${act}-${log_column}`}
                            label={t('features.wizard.columnVariability.variability_function_label')}
                            onChange={handleChange}
                            defaultValue={log_column.variate ? initialFunctions.get(log_column_name) : "" }
                            disabled={!log_column.variate}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {functions!= null && Object.values({...functions}).map((f:any) => (
                                <MenuItem value={f.id_code}>{f.function_name}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      }
                  </TableCell>
                  <TableCell>
                      { entry[0] === "Screenshot"?
                      <Button
                        variant="contained"
                        component={RouterLink}
                        to={`/get-gui-component-coordinates/${variant}/${act}/${log_column.initValue}`}
                        >
                        {t("features.wizard.columnVariability.screenshotVariability")}
                      </Button> : 
                      <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id={`params-${variant}-${act}-${log_column}`}>
                        <Typography component="div" >
                          {t('features.wizard.columnVariability.function_param_label')}:
                        </Typography>
                        </InputLabel>
                        <Select
                          id={`params-${variant}-${act}-${log_column}`}
                          label={t('features.wizard.columnVariability.function_param_label')}
                          onChange={handleChangeFunction}
                          defaultValue={log_column.variate ? initialParams.get(log_column_name) : "" }
                          disabled={!log_column.variate}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {params!= null && Object.keys({...params}).map((key, index) => (
                            <MenuItem value={params[index].id}>{params[index].label}</MenuItem>
                            ))}
                        </Select>
                        {/* <FormHelperText>With label + helper text</FormHelperText> */}
                      </FormControl>
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