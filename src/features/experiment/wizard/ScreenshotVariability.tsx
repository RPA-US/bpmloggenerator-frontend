import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { Button, Select, MenuItem, Box, TextField, Card, CardContent, Theme, Typography, Grid, CardMedia } from '@mui/material';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Tooltip from '@mui/material/Tooltip';
import { ICoordinates, IElements } from './types';
import { useSelector, useDispatch } from 'react-redux';
import { wizardSelector, wizardSlice, guiComponentCategoryRepository, guiComponentRepository, variabilityFunctionCategoryRepository } from './slice';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { authSelector } from 'features/auth/slice';

const funcitonList = [
  {
    "id": 1,
    "function_name": "copy_image",
    "description": "copy an image without changes",
    "params": [1, 2]
  },
  {
    "id": 2,
    "function_name": "change_ui",
    "description": "change element in ui",
    "params": []
  }
]

const guiList = [
  {
    "id": 1,
    "name": "inputText",
    "id_code": "element1",
    "filename": "",
    "path": "",
    "description": "GUI element to change with the function",
    "gui_component_category_id": 2
    },
    {
      "id": 2,
      "name": "Button",
      "id_code": "element2",
      "filename": "",
      "path": "",
      "description": "GUI element to change with the function",
      "gui_component_category_id": 2
      }
]

const paramList = [
  {
    "id": 1,
    "label": "Insert text",
    "placeholder": "Text",
    "data_type": "String",
    "validation_needs": "required",
    "description": "Insert a text in the screenshot "
  },
  {
    "id": 2,
    "label": "Random UI",
    "placeholder": "0",
    "data_type": "number",
    "validation_needs": "",
    "description": "Change the number passed of GUI elements randomly"
  }
]

const funcitonVariabilityResults = async (token: string) => {
  try {
    const { varFunc }: any = await variabilityFunctionCategoryRepository.list(token);
    return varFunc;
  } catch (ex) {
    console.error('error listing categories result', ex);
  }
}

const categoriesResult = async (token: string) => {
  try {
    const categories : any = await variabilityFunctionCategoryRepository.list(token);
    return categories;
  } catch (ex) {
    console.error('error listing categories result', ex);
  }
}

function selectCategoryByName(categories: any, name: string) {
  let test;
  try {
    test = categories.filter(function (itm: any) {
      if (itm.name === name) {
        return itm;
      }
    })
  } catch (ex) {
    console.error('error listing categories result', ex);
  }
  return test;
}

function selectVarFuncByCat(categoryId: number, varFunc: any) {
  let test;
  try {
    test = varFunc.filter(function (itm: any) {
      if (itm.category === categoryId) {
        return itm;
      }
    })
  } catch (ex) {
    console.error('error listing categories result', ex);
  }
  return test;
}

const ScreenshotVariability: React.FC = () => {
  const { elements } = useSelector(wizardSelector);
  var initialElements: IElements = { ...elements }
  var initialStateCoordinates: ICoordinates = { x1: 0, y1: 0, x2: 0, y2: 0, resolutionIMG: [0, 0], randomColor: "", processed: false, function_variability: 0, gui_component: 0, params: {} };
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
  //const { token } = useSelector(authSelector);
  //console.log(categoriesResult(token).results);
  //TODO: create repository call
  const variabilityFunctions = funcitonList;//selectVarFuncByCat(selectCategoryByName(categoriesResult(token),"Screenshot"), funcitonVariabilityResults(token));
  const params = paramList;
  const guiComponents = guiList;
  //TODO: si no hay imagen que cargar, redireccionar a lista

  function onLoadImage() {
    getResolutionBRW();
    onEvent();
  }

  function onEvent() {
    let countTMP = count
    for (const [key] of Object.entries(elementsTMP)) {
      if (count === 0 || Object.keys(elementsTMP).length === 0) {
        dispatch(wizardSlice.actions.setElements(elementsTMP))
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
  }

  function handleChangeGUI(e: any) {
    let guiTMP: number = e.target.value;
    setGUI(guiTMP);
  }
  

  function saveElements() {
    let coordinateTMP = coordinates
    let elementsTMP2 = elementsTMP;
    let coor: any = {};
    let paramsTMP = variabilityFunctions.filter(function (itm: any) {
      if (itm.id === functionID && itm.params.length > 0) {
        return itm;
      }
      if(itm.params.length === 0){
        return []
      }
    })
    if (Array.isArray(paramsTMP[0].params)) {
      for (var j in paramsTMP[0].params) {
        console.log((document.getElementById(paramsTMP[0].params[j].toString())as HTMLInputElement).value)
        if((document.getElementById(paramsTMP[0].params[j].toString())as HTMLInputElement).value!==null){
          coor[paramsTMP[0].params[j]] = (document.getElementById(paramsTMP[0].params[j].toString())as HTMLInputElement).value;
        }
      }
    } else {
      coor = {}
    }
    coordinateTMP.params = coor
    coordinateTMP.processed = true
    coordinateTMP.function_variability = functionID
    coordinateTMP.gui_component = guiID
    elementsTMP2[elementName] = coordinateTMP
    setElements({
      ...elementsTMP2
    })
    onEvent();
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
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} lg={4} item style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} >
          <Card>
            <CardContent>
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
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} lg={4} item style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} >
          {Object.keys(variabilityFunctions).map((key, index) => (
            variabilityFunctions[index].id === functionID && variabilityFunctions[index].params.length > 0 &&
            <Card>
              <CardContent>
                <Typography component="div" >
                  {t('features.experiment.assist.function.params_function')}
                </Typography>
                {Object.keys(params).map((key2, index2) => (
                  <Box component={"div"}>
                    <Typography component="div">{params[index2].description}:</Typography>
                    <TextField id={params[index2].id + ""} required={params[index2].validation_needs === "required"} placeholder={params[index2].placeholder} label={params[index2].label} type={params[index2].data_type} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid >
    </>
  )
}

export default ScreenshotVariability;