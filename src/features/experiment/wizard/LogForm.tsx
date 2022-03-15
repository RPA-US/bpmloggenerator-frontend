import React, {useContext, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Modal, TextField, Typography,Theme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Table from '@mui/material/Table';
import { FunctionParamDTO } from 'infrastructure/http/dto/wizard';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { wizardSelector, updateVariateValue, wizardSlice } from 'features/experiment/wizard/slice';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeContext } from '@emotion/react';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const LogForm: React.FC = () => {
  const { t } = useTranslation();
  const colorRef = useRef<any>("");
  const sizeRef = useRef<any>(0);
  const { variant } = useParams<{ variant: string }>();
  const { act } = useParams<{ act: string }>();
  const dispatch = useDispatch();
  const { seed, functions, params, screenshot_functions, gui_components, initialValues } = useSelector(wizardSelector);
  const theme = useContext(ThemeContext) as Theme;
  const [functionID, setFunctionID] = useState(0);
  const [open, setOpen] = useState(false);
  const [param_args, setParamArgs] = useState({});
  const [param_column, setParamColumn] = useState('');
  const initialparams: FunctionParamDTO[] = []
  const [paramsL, setParams] = useState(initialparams);
  const listRef = useRef<any>("");

  const handleVariateOnClick = (variant: string, act: string, log_column_name: string, event: any) => {
    const selectedValue = event.target.checked ? 1 : 0;
    dispatch(updateVariateValue(variant, act, log_column_name, selectedValue));
  };

  const handleChangeFunction = (variant: string, act: string, column: string, log_column_conf: any, event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    if (selectedValue !== "") {
      const functionSelected: any = functions?.filter(f => f.id_code === selectedValue)[0];
      dispatch(wizardSlice.actions.setPossibleParamsInitialValues({ column: column, function_selected: functionSelected }));
      dispatch(wizardSlice.actions.setFunctionNameVariabilityFunction({ variant, act, column, function_name: selectedValue }));
      setFunctionID(functionSelected.id);
      let paramTMP:FunctionParamDTO[] = []
      for(let p of params){
        if(functionSelected.params.includes(p.id)){
          paramTMP.push(p)
        }
      }
      setParams([...paramTMP]);
    } else {
      dispatch(updateVariateValue(variant, act, column, 0));
    }

  };


  const handleOpen = (column: string) => {
    let tmpParam = {}
    setParamArgs({...tmpParam});
    setParamColumn(column);
    setOpen(true);
  }
  const handleClose = (column: string) => {
    console.log(param_args)
    dispatch(wizardSlice.actions.setParamsColumnVariabilityColumn({ variant, act, column, param_column, param_args }));
    setParamColumn('');
    let tmpParam = {}
    setParamArgs({...tmpParam});
    setOpen(false);
  };

  const handleChangeParam = (
    function_param: any,
    event: any
  ) => {
    const selectedValue = event.target.value;
    setParamArgs({
      ...param_args,
      [function_param.label]: [selectedValue]
    });
  };

  const ParamFormModal = (log_column_name: string, log_column: any) => {
    const defaultValue = log_column.variate === 1 && initialValues[log_column_name] ? initialValues[log_column_name].params : "";
    const possible_params: Array<number> = initialValues[log_column_name]?.params?.possible_params;
    const function_params: FunctionParamDTO[] = params.filter(p => Object.values(possible_params).includes(p.id));
    return (
      <div>
        <Button disabled={!log_column.variate} onClick={() => handleOpen(log_column_name)}>{t("features.wizard.columnVariability.configureParams")}</Button>
        <Modal
          onClose={() => handleClose(log_column_name)}
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {t("features.wizard.columnVariability.paramModalTitle")}
              </Typography>
              {Object.keys(functions).map((key, index) => (
                functions[index].id === functionID && functions[index].params.length > 0 &&
                <Box component={"div"} style={{ marginTop: theme.spacing(2) }} >
                  <Typography component="div" >
                    {t('features.experiment.assist.function.params_function')}
                  </Typography>
                  {Object.keys(paramsL).map((key2, index2) => (
                    <Box component={"div"}>
                      <Typography component="div">{t(paramsL[index2].description)}:</Typography>
                      {(paramsL[index2].data_type !== "element") && (paramsL[index2].data_type !== "font") && (paramsL[index2].data_type !== "list") &&
                        <TextField id={paramsL[index2].id + ""} placeholder={t(paramsL[index2].placeholder)} label={t(paramsL[index2].label)} type={paramsL[index2].data_type} onChange={e => handleChangeParam(functions[index], e)}/>
                      }
                      {(paramsL[index2].data_type === "font") &&
                        <Box component={"div"} style={{ marginTop: theme.spacing(2) }}>
                          <Select
                            id="select_font"
                            required={true}
                            value={'resources/Roboto-Black.ttf'}
                            label={t('features.experiment.assist.function.variability_function')}
                            onChange={handleChangeParam}
                          >
                            <MenuItem value={'resources/Roboto-Black.ttf'}>Roboto_font</MenuItem>
                          </Select>
                          <Box component={"div"} style={{ marginTop: theme.spacing(2) }}>
                            <TextField id="outlined-basic" inputRef={sizeRef} label={t('features.experiment.assist.function.font_size')} variant="outlined" type="number"  onChange={e => handleChangeParam(functions[index], e)}/>
                          </Box>
                          <Box component={"div"} style={{ marginTop: theme.spacing(2) }}>
                            <TextField id="outlined-basic" inputRef={colorRef} label={t('features.experiment.assist.function.font_color')} variant="outlined" type="String" onChange={e => handleChangeParam(functions[index], e)}/>
                          </Box>
                        </Box>
                      }
                      {(paramsL[index2].data_type === "list") &&
                        <TextField id={paramsL[index2].id + ""} inputRef={listRef} placeholder={t(paramsL[index2].placeholder)} label={t(paramsL[index2].label)} type={paramsL[index2].data_type} onChange={e => handleChangeParam(functions[index], e)}/>
                      }
                    </Box>
                  ))}
                </Box>
              ))}
          </Box>
        </Modal>
      </div>
    );
  }

  const LogFormTableRow = (log_column: [string, any]) => {
    return (
      <TableRow
        key={`${variant}-${act}-${log_column[0]}`}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell align="center">
          {log_column[0]}
        </TableCell>
        <TableCell>
          <Checkbox
            key={`variate-${variant}-${act}-${log_column[0]}`}
            defaultChecked={initialValues[log_column[0]]?.variate === 1}
            onClick={(e) => handleVariateOnClick(variant, act, log_column[0], e)}
          />
        </TableCell>
        <TableCell>
          {log_column[0] === "Screenshot" ?
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id={`function-${variant}-${act}-${log_column[0]}`}>
                <Typography component="div" >
                  {t('features.wizard.columnVariability.screenshot_name_function')}
                </Typography>
              </InputLabel>
              <Select
                id={`function-${variant}-${act}-${log_column[0]}`}
                label={t('features.wizard.columnVariability.screenshot_name_function')}
                onChange={(e: any) => handleChangeFunction(variant, act, log_column[0], log_column[1], e)}
                disabled={log_column[1].variate === 1}
              >
                {screenshot_functions != null && Object.values(screenshot_functions).map((f: any, sc_index) => (
                  <MenuItem key={`screenshot-function-menuitem-${variant}-${act}-${log_column[0]}-${sc_index}`} value={f.id_code}>{t(f.function_name)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            :
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id={`function-${variant}-${act}-${log_column[0]}`}>
                <Typography component="div" >
                  {t('features.wizard.columnVariability.variability_function_label')}
                </Typography>
              </InputLabel>
              <Select
                id={`function-${variant}-${act}-${log_column[0]}`}
                label={t('features.wizard.columnVariability.variability_function_label')}
                onChange={e => handleChangeFunction(variant, act, log_column[0], log_column[1], e)}
                defaultValue={initialValues[log_column[0]]?.variate === 1 ? initialValues[log_column[0]].function : ""}
                disabled={log_column[1].variate !== 1}
              >
                {functions != null && Object.values({ ...functions }).map((f: any, f_index) => (
                  <MenuItem key={`function-menuitem-${variant}-${act}-${log_column[0]}-${f_index}`} value={f.id_code}>{t(f.function_name)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          }
        </TableCell>
        <TableCell>
          {log_column[0] === "Screenshot" ?
            <Button
              disabled={log_column[1].variate !== 1}
              variant="contained"
              component={RouterLink}
              to={`/get-gui-component-coordinates/case/${variant}/${act}/${log_column[1].initValue}`}
            >
              {t("features.wizard.columnVariability.screenshotVariability")}
            </Button> :
            ParamFormModal(log_column[0], log_column[1])
          }
        </TableCell>
      </TableRow>)
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
            Object.entries(seed[variant][act]).map((log_column: [string, any]) => (
              LogFormTableRow(log_column)
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default LogForm;