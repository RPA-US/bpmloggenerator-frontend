import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { Button, Select, MenuItem, Box, TextField, Card, CardContent, Theme, Typography, Grid, CardMedia } from '@mui/material';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Tooltip from '@mui/material/Tooltip';
import { IDependency, ICoordinates, IElements, IScreenshot, IArguments } from './types';
import { useSelector, useDispatch } from 'react-redux';
import { wizardSelector, wizardSlice, guiComponentCategoryRepository, guiComponentRepository, variabilityFunctionCategoryRepository, variabilityFunctionRepository, paramFunctionCategoryRepository } from './slice';
import { Link as RouterLink } from 'react-router-dom';
import { authSelector } from 'features/auth/slice';
import { FunctionParamResponse, CategoryResponse, CategoryDTO, GUIComponentDTO, FunctionParamDTO, VariabilityFunctionDTO, VariabilityFunctionResponse, GUIComponentResponse } from 'infrastructure/http/dto/wizard'
import { useHistory, useParams } from 'react-router-dom';


const ScreenshotVariability: React.FC = () => {
  const { elements, seed } = useSelector(wizardSelector);
  const { variant } = useParams<{ variant: string }>();
  const { act } = useParams<{ act: string }>();
  const { screenshot_filename } = useParams<{ screenshot_filename: string }>();
  var initialElements: IElements = { ...elements };
  var initialStateCoordinates: ICoordinates = { x1: 0, y1: 0, x2: 0, y2: 0, resolutionIMG: [0, 0], randomColor: "", processed: false, function_variability: 0, gui_component: 0, params: {}, dependency: { Activity: "", V: 0, id: 0 } };
  var initialVarFunction: VariabilityFunctionDTO[] = []
  var initialparams: FunctionParamDTO[] = []
  var initialguiComponents: GUIComponentDTO[] = []
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as Theme;
  const url = process.env.PUBLIC_URL + "example_image.png";//TODO:cambiar a la url real
  const [resolutionBRW, setResolution] = useState([0, 0]);
  const [coordinates, setcoordinates] = useState(initialStateCoordinates);
  const [functionID, setFunction] = useState(0);
  const [guiID, setGUI] = useState(0);
  var [elementsTMP, setElements] = useState(initialElements);
  const [count, setCount] = useState(Object.keys(elementsTMP).length)
  const [elementName, setName] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const { token } = useSelector(authSelector);
  const [variabilityFunctions, setVariabilityFunctions] = useState(initialVarFunction);
  const [paramsList, setParamsFunctions] = useState(initialparams);
  const [params, setParams] = useState(initialparams);
  const [guiComponents, setGuiComponents] = useState(initialguiComponents);
  const [json_conf, setjJon_conf] = useState({ ...seed });
  const actRef = useRef<any>('');
  const varRef = useRef<any>(0);
  //create repository call
  //Functions by category name
  const selectVarFuncByCat = async (token: string, name: string) => {
    let categories: CategoryResponse = await variabilityFunctionCategoryRepository.list(token);
    let categoryId = selectCategoryByName(categories.results, name);
    let varFunc = await variabilityFunctionRepository.list(token);
    let test;
    try {
      let ret: VariabilityFunctionDTO[] = [];
      test = varFunc.results.filter(function (itm: any) {
        if (itm.variability_function_category === categoryId[0].id) {
          ret.push(itm);
        }
        setVariabilityFunctions([...ret]);
        return ret;
      })
    } catch (ex) {
      console.error('error listing functions by category result', ex);
    }
    return test;
  }
  //GUI components by category name
  const selectGUIByCat = async (token: string, name: string) => {
    let categories: CategoryResponse = await guiComponentCategoryRepository.list(token);
    let categoryId = selectCategoryByName(categories.results, name);
    let guiComp = await guiComponentRepository.list(token);
    let test;
    try {
      let ret: GUIComponentDTO[] = [];
      test = guiComp.results.filter(function (itm: any) {
        if (itm.gui_component_category === categoryId[0].id) {
          ret.push(itm);
        }
        setGuiComponents([...ret]);
        return ret;
      })
    } catch (ex) {
      console.error('error listing functions by category result', ex);
    }
    return test;
  }
  //Params
  const paramsListResults = async (token: string) => {
    try {
      let paramTMP: FunctionParamResponse = await paramFunctionCategoryRepository.list(token);
      setParamsFunctions([...paramTMP.results]);
      return paramTMP.results;
    } catch (ex) {
      console.error('error getting params function result', ex);
    }
  }

  function paramsByFunction(functionTMP: number) {
    let paramsTMP: FunctionParamDTO[] = [];
    let paramsID = []
    for (let f of variabilityFunctions) {
      if (f.id === functionTMP && f.params.length > 0) {
        for (let id2 of paramsList) {
          paramsID = f.params.filter(c => (id2.id===c)?c:"");
          if (paramsID.length > 0) {
            paramsTMP.push(id2);
          }
        }
      }
    }
    setParams([...paramsTMP]);
  }

  function onLoadImage() {
    selectVarFuncByCat(token ?? "", "Screenshot");
    selectGUIByCat(token ?? "", "Screenshot");
    paramsListResults(token ?? "");
    getResolutionBRW();
    onEvent();
  }

  function onEvent() {
    let countTMP = count
    for (const [key] of Object.entries(elementsTMP)) {
      if (count === 0 || Object.keys(elementsTMP).length === 0) {
        let jsonTMP = conversionElementToJson(elementsTMP);
        dispatch(wizardSlice.actions.setVariabilityConfiguration({ ...jsonTMP }))
        history.push('/assist-experiment')
      } else {
        if (elementsTMP[key].processed === false) {
          let coor = elementsTMP[key]
          setcoordinates({ ...coor });
          setName(key)
          countTMP = countTMP - 1
          setCount(countTMP);
          break;
        }
      }
    }
  }

  function conversionElementToJson(elementsTMP: IElements) {
    let copy_json = json_conf;
    let tmpScreen: IScreenshot = {}
    let countID = 1;
    for (const [key] of Object.entries(elementsTMP)) {
      let  funcTMP = getByID(variabilityFunctions, elementsTMP[key].function_variability);
      let guiTMP = getByID(guiComponents, elementsTMP[key].gui_component);
      let depTMP: IDependency = elementsTMP[key].dependency
      let tmpArgs: IArguments;
      if (depTMP.Activity !== "" && depTMP.V !== 0) {
        depTMP.id = countID;
        tmpArgs = { id: countID, coordinates: [elementsTMP[key].x1, elementsTMP[key].y1, elementsTMP[key].x2, elementsTMP[key].y2], name: funcTMP.id_code, args: elementsTMP[key].params, dependency: depTMP };
      } else {
        tmpArgs = { id: countID, coordinates: [elementsTMP[key].x1, elementsTMP[key].y1, elementsTMP[key].x2, elementsTMP[key].y2], name: funcTMP.id_code, args: elementsTMP[key].params };
      }
      if (tmpScreen.hasOwnProperty(guiTMP)) {
        let listARGS = tmpScreen[guiTMP]
        listARGS.push(tmpArgs)
        tmpScreen[guiTMP.id_code] = listARGS
      } else {
        tmpScreen[guiTMP.id_code] = [tmpArgs]
      }
      countID = countID + 1;
    }
    copy_json[variant][act].screenshot = tmpScreen;
    return copy_json;
  }

  function getByID(obj: any, idO: number) {
    return obj.find((o: { id: number; }) => (o.id === idO) ? o : null)
  }

  function selectCategoryByName(categories: any, name: string) {
    let test;
    try {
      test = categories.filter(function (itm: any) {
        let ret = "";
        if (itm.name === name) {
          return ret = itm;
        }
        return ret;
      })
    } catch (ex) {
      console.error('error selecting category by name result', ex);
    }
    return test;
  }

  window.onresize = function () {
    getResolutionBRW()
  }

  function getResolutionBRW() {
    var imgRect: any = document.getElementById('imgRect');
    var width: number = imgRect.clientWidth;
    var height: number = imgRect.clientHeight;
    let newRes = resolutionBRW;
    newRes[0] = width;
    newRes[1] = height;
    setResolution([...newRes]);
  }

  const removeElement = () => {
    let key = elementName;
    let elementsCopy = elementsTMP;
    delete elementsCopy[key];
    setElements(
      { ...elementsCopy }
    )
    onEvent();
  }

  function resizeRect(x: any, brw: any, img: any) {
    return Math.round(brw * x / img);
  }

  function handleChangeFunction(e: any) {
    let functionTMP: number = e.target.value;
    setFunction(functionTMP);
    paramsByFunction(functionTMP);
  }

  function handleChangeGUI(e: any) {
    let guiTMP: number = e.target.value;
    setGUI(guiTMP);
  }


  function saveElements() {
    if (functionID !== 0 && guiID !== 0) {
      let coordinateTMP = coordinates
      let elementsTMP2 = elementsTMP;
      let coor: any = {};
      let paramsTMP = variabilityFunctions.filter(f => (f.id === functionID) ? f : null);
      if (paramsTMP !== null && paramsTMP.length > 0) {
        if (paramsTMP[0].params.length > 0) {
          for (let j in params) {
            if ((document.getElementById(params[j].id.toString()) as HTMLInputElement).value !== null) {
              coor[params[j].label] = (document.getElementById(params[j].id.toString()) as HTMLInputElement).value;
            }
          }
        }
      }
      coordinateTMP.params = coor
      coordinateTMP.processed = true
      coordinateTMP.function_variability = functionID
      coordinateTMP.gui_component = guiID
      if (actRef.current.value !== "" && varRef.current.value !== 0) {
        coordinateTMP.dependency.Activity = actRef.current.value.trim()
        coordinateTMP.dependency.V = varRef.current.value.trim()
      }
      elementsTMP2[elementName] = coordinateTMP
      setElements({
        ...elementsTMP2
      })
      onEvent();
    }
  }


  return (
    <>
      <Typography variant="h4">
        {t('features.experiment.assist.title.elementselector')}
      </Typography>
      <Button
        onClick={saveElements}
        variant="outlined"
        style={{ fontSize: "small", marginLeft: 4 }}
        endIcon={<SettingsSuggestIcon />}>
        {t('features.experiment.assist.next')}</Button>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="flex-start"
        spacing={4}>
        <Grid xs={12} lg={12} item style={{ marginTop: theme.spacing(2) }} >
          <Card>
            <Box component={"div"}
              sx={
                {
                  position: "relative"
                }}>
              <Box component={"div"}
                sx={
                  {
                    position: "absolute",
                    left: resizeRect(coordinates.x1, resolutionBRW[0], coordinates.resolutionIMG[0]),
                    top: resizeRect(coordinates.y1, resolutionBRW[1], coordinates.resolutionIMG[1]),
                    width: resizeRect(coordinates.x2, resolutionBRW[0], coordinates.resolutionIMG[0]) - resizeRect(coordinates.x1, resolutionBRW[0], coordinates.resolutionIMG[0]),
                    height: resizeRect(coordinates.y2, resolutionBRW[1], coordinates.resolutionIMG[1]) - resizeRect(coordinates.y1, resolutionBRW[1], coordinates.resolutionIMG[1]),
                    outline: "2px solid black",
                    backgroundColor: coordinates.randomColor,
                    opacity: 0.3
                  }}
              ></Box>
              < CardMedia
                component="img"
                id="imgRect"
                image={url}
                alt="mock"
                style={{
                  height: "auto",
                  maxWidth: "100%"
                }}
                onLoad={onLoadImage}
                draggable={false}
              />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} lg={4} item style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} >
          <Card>
            <CardContent>
              <Typography component="div" >
                {t('features.experiment.assist.element.name')}: {elementName}
              </Typography>
              <Typography component="div">
                {t('features.experiment.assist.coordinates.coordinates')}:
              </Typography>
              <Typography component="div" >
                {t('features.experiment.assist.coordinates.topleft')}: ({coordinates.x1}, {coordinates.y1})
              </Typography>
              <Typography component="div">
                {t('features.experiment.assist.coordinates.rightbot')}:({coordinates.x2}, {coordinates.y2})
              </Typography>
              <Grid container justifyContent="center" >
                <Button variant="contained" color="secondary" style={{ margin: theme.spacing(2) }} onClick={removeElement}>
                  {t('features.experiment.assist.delete')}
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} lg={4} item style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} >
          <Card>
            <CardContent>
              <Typography component="div" >
                {t('features.experiment.assist.function.variability_function')}:
              </Typography>
              <Select
                id="select_function"
                value={functionID}
                label={t('features.experiment.assist.function.variability_function')}
                onChange={handleChangeFunction}
              >
                {Object.keys(variabilityFunctions).map((key, index) => (
                  <MenuItem value={variabilityFunctions[index].id}>{variabilityFunctions[index].function_name}</MenuItem>
                ))}
              </Select>
              {Object.keys(variabilityFunctions).map((key, index) => (
                variabilityFunctions[index].id === functionID && variabilityFunctions[index].params.length > 0 &&
                <Box component={"div"} style={{ marginTop: theme.spacing(2) }} >
                  <Typography component="div" >
                    {t('features.experiment.assist.function.params_function')}
                  </Typography>
                  {Object.keys(params).map((key2, index2) => (
                    <Box component={"div"}>
                      <Typography component="div">{params[index2].description}:</Typography>
                      <TextField id={params[index2].id + ""} required={params[index2].validation_needs === "required"} placeholder={params[index2].placeholder} label={params[index2].label} type={params[index2].data_type} />
                    </Box>
                  ))}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} lg={4} item style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} >
          <Card>
            <CardContent>
              <Box component={"div"}>
                <Typography component="div" >
                  {t('features.experiment.assist.function.gui_components')}:
                </Typography>
                <Select
                  id="select_gui"
                  value={guiID}
                  label={t('features.experiment.assist.function.gui_components')}
                  onChange={handleChangeGUI}
                >
                  {Object.keys(guiComponents).map((key, index) => (
                    <MenuItem value={guiComponents[index].id}>{guiComponents[index].name}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box component={"div"} style={{ marginTop: theme.spacing(2) }} >
                <TextField inputRef={actRef} placeholder={t('features.experiment.assist.function.activity_dependency')} label={t('features.experiment.assist.function.activity_dependency')} />
              </Box>
              <Box component={"div"} style={{ marginTop: theme.spacing(2) }} >
                <TextField inputRef={varRef} placeholder={t('features.experiment.assist.function.variant_dependency')} label={t('features.experiment.assist.function.variant_dependency')} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid >
    </>
  )
}

export default ScreenshotVariability;