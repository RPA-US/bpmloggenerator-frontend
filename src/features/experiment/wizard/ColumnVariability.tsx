import React, { ColgroupHTMLAttributes, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, Modal, Card, CardActions, CardContent, TextField, Theme, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { InitialValues } from './types';
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
import { wizardSelector, loadFunctionsAndCategories, updateJsonConf, updateVariateValue, loadInitValues, wizardSlice } from 'features/experiment/wizard/slice';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
  const theme = useContext(ThemeContext) as Theme;
  const { variant } = useParams<{ variant: string }>();
  const { act } = useParams<{ act: string }>();
  const dispatch = useDispatch();
  
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const { seed, functions, params, category_functions, screenshot_functions, initialValues } = useSelector(wizardSelector);
  if (functions === null || params === null || category_functions === null)
    dispatch(loadFunctionsAndCategories());
  
  
  useEffect(() => {
    if (functions === null || params === null || category_functions === null) {
      dispatch(loadFunctionsAndCategories());
    }
  }, [ dispatch ])

  useEffect(() => {
    dispatch(loadInitValues(variant, act));
  }, [ seed ])
  
  const handleVariateOnClick = (variant: string, act: string, log_column_name: string, event: any) => {
    const selectedValue = event.target.checked ? 1 : 0;
    dispatch(updateVariateValue(variant, act, log_column_name, selectedValue))
  };
  
  const handleChangeFunction = (variant: string, act: string, column: string, log_column_conf: any, event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    if(selectedValue !== ""){
      const log_column_conf_updated = {
        ...log_column_conf,
        name: selectedValue
      }
      const functionSelected: any = functions?.filter(f => f.id_code === selectedValue)[0];
      // initialValues[column].params = functionSelected.params;
      const aux_init_values = {
        ...initialValues,
        [column]:{
          ...initialValues[column],
          params: functionSelected.params
        } 
      }
      dispatch(wizardSlice.actions.setInitialValues(aux_init_values));
      dispatch(updateJsonConf(variant, act, column, log_column_conf_updated));
    } else {
      dispatch(updateVariateValue(variant, act, column, 0));
    }
  };
  
  // const handleChangeParam = (variant: string, act: string, column: string, log_column_conf: any, event: SelectChangeEvent) => {
  //   const selectedValue = event.target.value;
  //   console.log(selectedValue)
  // };
  
  const ParamFormModal = (variant: string, act: string, log_column_name: string, log_column: any) => {
    const defaultValue = log_column.variate===1 && initialValues[log_column_name] ? initialValues[log_column_name].params : "";
    const initial_possible_params = initialValues[log_column_name] && initialValues[log_column_name].params.possible_params;
    let function_params: any[] = [];
    // if(initial_possible_params){
    //   function_params = params.filter(p => p.id in initial_possible_params);
    // }
    return (
      <div>
        <Button disabled={!log_column.variate} onClick={handleOpen}>{t("features.wizard.columnVariability.configureParams")}</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            {seed[variant][act][log_column_name]["name"]}: {t("features.wizard.columnVariability.paramModalTitle")}
            </Typography>
            {/* {function_params && Object.keys(function_params).map((key: any) => (
              <div>
                <Typography component="div">{key.description}:</Typography>
                <TextField id={key.id + ""} required={key.validation_needs === "required"}
                placeholder={key.placeholder} label={key.label} type={key.data_type} />
              </div>
            ))} */}
          </Box>
        </Modal>
      </div>
    );
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
          Object.entries(seed[variant][act]).map( entry => {
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
                      defaultChecked={ initialValues[log_column_name] && initialValues[log_column_name].variate === 1 }
                      onClick={(e) => handleVariateOnClick(variant, act, log_column_name, e)}
                      />
                  </TableCell>
                  <TableCell>
                      { entry[0] === "Screenshot"?
                          <FormControl sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id={`function-${variant}-${act}-${log_column}`}>
                          <Typography component="div" >
                          {t('features.wizard.columnVariability.screenshot_name_function')}
                          </Typography>
                          </InputLabel>
                          <Select
                            id={`function-${variant}-${act}-${log_column}`}
                            label={t('features.wizard.columnVariability.screenshot_name_function')}
                            onChange={(e:any) => handleChangeFunction(variant, act, log_column_name, log_column, e)}
                            disabled={log_column.variate}
                            >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {screenshot_functions!= null && Object.values({...screenshot_functions}).map((f:any) => (
                              <MenuItem value={f.id_code}>{f.function_name}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        : 
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id={`function-${variant}-${act}-${log_column}`}>
                          <Typography component="div" >
                          {t('features.wizard.columnVariability.variability_function_label')}
                          </Typography>
                          </InputLabel>
                          <Select
                            id={`function-${variant}-${act}-${log_column}`}
                            label={t('features.wizard.columnVariability.variability_function_label')}
                            onChange={e => handleChangeFunction(variant, act, log_column_name, log_column, e)}
                            defaultValue={ initialValues[log_column_name] && initialValues[log_column_name].variate===1 ? initialValues[log_column_name].function : "" }
                            disabled={!log_column.variate}
                            >
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
                        disabled={!log_column.variate}
                        variant="contained"
                        component={RouterLink}
                        to={`/get-gui-component-coordinates/${variant}/${act}/${log_column.initValue}`}
                        >
                        {t("features.wizard.columnVariability.screenshotVariability")}
                      </Button> : 
                        ParamFormModal(variant, act, log_column_name, log_column)
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