import React, { useContext, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { IconButton, Select, MenuItem, Box, TextField, Button, Card, CardContent, Theme, Typography, Grid, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, OutlinedInput, SelectChangeEvent } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useSelector, useDispatch } from 'react-redux';
import { screenshotRepository, wizardSelector, wizardSlice, guiComponentCategoryRepository, guiComponentRepository, variabilityFunctionCategoryRepository, variabilityFunctionRepository, paramFunctionCategoryRepository } from './slice';
import { useHistory, useParams } from 'react-router-dom';
import { experimentsSelector } from '../slice';
import { authSelector } from 'features/auth/slice';
import { IDependency, IScreenshotColumn, IScreenshot, IArguments } from './types';
import { FunctionParamResponse, CategoryResponse, CategoryDTO, GUIComponentDTO, FunctionParamDTO, VariabilityFunctionDTO, GUIComponentResponse } from 'infrastructure/http/dto/wizard'
import { getByID } from '../utils';
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Tooltip from '@mui/material/Tooltip';
import configuration from "infrastructure/util/configuration";
import { Screenshot } from '@mui/icons-material';

export interface IRandomColor {
    [name: string]: string[]
}

const ExperimentGetGUIComponentsCoordenates: React.FC = () => {
    //Load externar data
    const { seed, params, functions, category_functions, gui_components, scenario_variability } = useSelector(wizardSelector);
    const { detail } = useSelector(experimentsSelector);
    const { variant } = useParams<{ variant: string }>();
    const { act } = useParams<{ act: string }>();
    const { screenshot_filename } = useParams<{ screenshot_filename: string }>();
    const { variability_mode } = useParams<{ variability_mode: string }>();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const { token } = useSelector(authSelector);
    const theme = useContext(ThemeContext) as Theme;

    //Init tmp var
    const initialArgs: IArguments = { id: 0, coordinates: [], name: "", args: {} }
    const initialScreen: IScreenshot = {}
    const countID: number = 1;
    const initialDependency: IDependency = { Activity: "", V: 0, id: 0 }
    const initialparams: FunctionParamDTO[] = []
    const initialVarFunction: VariabilityFunctionDTO[] = []
    const initialguiComponents: CategoryDTO[] = []
    const initialColors: IRandomColor = {}
    const initialVariants: string[] = []
    const initialElements: GUIComponentDTO[] = []
    const initialElementID: string[] = []
    const initialVarAct: string[] = ["", "", ""]

    //Status var to use
    let init_seed = { ...seed };
    let redirect_at_end = configuration.PREFIX + '/column-variability/';
    if (variability_mode === 'scenario') {
        init_seed = { ...scenario_variability };
        redirect_at_end = configuration.PREFIX + '/scenario-variability/';
    }
    const [json_conf, setjJon_conf] = useState(init_seed);

    //Temporary var
    const [resolutionBRW, setResolutionBRW] = useState([0, 0]);
    const [resolutionIMG, setResolutionIMG] = useState([0, 0]);
    const [functionID, setFunction] = useState(0);
    const [guicatID, setGUIcatID] = useState(0);
    const [fontID, setFontID] = useState('');
    const [elementID, setElementID] = useState(initialElementID);
    const [count, setCount] = useState(countID);
    const [url, setUrl] = useState("");//process.env.PUBLIC_URL + "example_image.png"
    const [screenshots, setScreenshot] = useState(initialScreen);
    const [argumentsCoor, setArgumentsCoor] = useState(initialArgs);
    const [randomColor, setRandomColor] = useState(initialColors);
    const [errorMessage, setErrorMessage] = useState(false);

    //DB load
    const [variabilityFunctions, setVariabilityFunctions] = useState(initialVarFunction);
    const [paramsList, setParamsFunctions] = useState(initialparams);
    const [guiComponentsCat, setGuiComponentsCat] = useState(initialguiComponents);
    const [paramsL, setParams] = useState(initialparams);
    const [variantDependency, setVariantDependency] = useState(initialVariants);
    const [activityDependency, setActivityDependency] = useState(initialVariants);
    const [idVariant, setIdVariant] = useState(initialVariants);
    const [elements, setElements] = useState(initialElements);
    const [components, setComponents] = useState(initialElements);
    const [varAct, setVarAct] = useState(initialVarAct);
    const colorRef = useRef<any>('');
    const colorBackRef = useRef<any>('');
    const sizeRef = useRef<any>(0);
    const listRef = useRef<any>("");

    //Select box colorized inside screenshot
    const [coorR, setCoorR] = useState([0, 0, 0, 0]);
    const [drawing, setDrawing] = useState(false);

    const getScreenshot = async (token: string, path: string) => {
        let src = '';
        if (url === "") {

            try {
                const imageBlob = await screenshotRepository.get(
                    path, token
                );
                src = URL.createObjectURL(imageBlob);
                setUrl(src);
            } catch (ex) {
                console.error('error screenshot show', ex);
            }
        }

        return src;
    }

    //Get DB info
    const selectVarFuncByCat = async (token: string, name: string) => {
        let categories: CategoryDTO[] = []
        if (Object.keys(category_functions).length > 0 ) {
            categories = category_functions
        } else {
            let categoriesRes: CategoryResponse = await variabilityFunctionCategoryRepository.list(token);
            categories = categoriesRes.results
        }
        let categoryId = selectCategoryByName(categories, name);
        let varFunc: VariabilityFunctionDTO[] = []
        if (Object.keys(functions).length > 0 ) {
            varFunc = functions
        } else {
            let varFuncRes = await variabilityFunctionRepository.list(token);
            varFunc = varFuncRes.results
        }
        let test;
        try {
            let ret: VariabilityFunctionDTO[] = [];
            test = varFunc.filter(function (itm: any) {
                if (itm.variability_function_category === categoryId[0].id) {
                    ret.push(itm);
                }
                setVariabilityFunctions([...ret]);
            })
            return ret;
        } catch (ex) {
            console.error('error listing functions by category result', ex);
        }
        return test;
    }

    const selectGUICat = async (token: string) => {
        let categories: CategoryResponse = await guiComponentCategoryRepository.list(token);
        let test: CategoryDTO[] = [];
        try {
            test = categories.results
            setGuiComponentsCat([...test])
        } catch (ex) {
            console.error('error listing functions by category result', ex);
        }
        return test;
    }

    function componentsByCatID(gid: number) {
        let guiCat: GUIComponentDTO[] = elements;
        let l = guiCat.filter(g => (g.gui_component_category === gid) ? g : "")
        return l
    }

    const selectElement = async (token: string) => {
        let test: GUIComponentDTO[] = [];
        try {
            if (Object.keys(gui_components).length > 0 ) {
                test = gui_components
            } else {
                let categories: GUIComponentResponse = await guiComponentRepository.list(token);
                test = categories.results
            }
            setElements([...test])
        } catch (ex) {
            console.error('error listing functions by category result', ex);
        }
        return test;
    }

    const paramsListResults = async (token: string) => {
        let paramTMP: FunctionParamDTO[] = []
        try {
            if (Object.keys(params).length > 0 ) {
                paramTMP = params
            } else {
                let paramRes: FunctionParamResponse = await paramFunctionCategoryRepository.list(token);
                paramTMP = paramRes.results;
            }
            setParamsFunctions([...paramTMP]);
        } catch (ex) {
            console.error('error getting params function result', ex);
        }
    }

    //Load screenshot previous configuration
    function screenshotConfigured() {
        let jsonTMP = json_conf;
        let screenshotWizard = { ...jsonTMP[variant][act]["Screenshot"].args }
        let listKeys = Object.keys(screenshotWizard)
        if (listKeys.length > 0) {
            let colorTMP = initialColors
            let screenshotTMP = screenshots
            for (let key of listKeys) {
                let listColor: string[] = []
                let tmpArgs = screenshotWizard[key]
                for (let key2 in tmpArgs) {
                    listColor.push("#" + Math.floor(Math.random() * 16777215).toString(16))
                    setCount(tmpArgs[key2].id + 1)
                }
                Object.keys(screenshotWizard[key]).map((key2) => (listColor.push("#" + Math.floor(Math.random() * 16777215).toString(16))))
                colorTMP[key] = listColor
            }
            screenshotTMP = JSON.parse(JSON.stringify(screenshotWizard))
            setRandomColor({ ...colorTMP });
            setScreenshot({ ...screenshotTMP });
            setArgumentsCoor({ ...initialArgs });
        }
    }

    function paramsByFunction(functionTMP: number) {
        let paramsTMP: FunctionParamDTO[] = [];
        for (let p of paramsList) {
            if (p.variability_function.id === functionTMP) {
                paramsTMP.push(p);
            }
        }
        setParams([...paramsTMP]);
    }

    //Seed variants
    function seedVariants() {
        let variantListTMP: string[] = []
        Object.keys(json_conf).map((key) => (variantListTMP.push(key)))
        setVariantDependency([...variantListTMP])
    }

    function activitiesByVariant(variantKey: string) {
        let activityListTMP: string[] = []
        Object.keys(json_conf[variantKey]).map((key) => (activityListTMP.push(key)))
        setActivityDependency([...activityListTMP])
    }

    function IDbyActivities(variantKey: string, activityKey: string) {
        let idListTMP: string[] = []
        if (variantKey === variant && activityKey === act) {
            Object.keys(screenshots).map((key, index) => (
                Object.keys(screenshots[key]).map((key2, index2) => (
                    idListTMP.push(screenshots[key][index2].id + "")
                ))))
        } else {
            if (Object.keys(json_conf[variantKey][activityKey]["Screenshot"]["args"]).length > 0) {
                for (let key in json_conf[variantKey][activityKey]["Screenshot"]["args"]) {
                    let tmpArgs = json_conf[variantKey][activityKey]["Screenshot"]["args"][key]
                    for (let key2 in tmpArgs) {
                        idListTMP.push(tmpArgs[key2].id + "")
                    }
                }
            }
        }
        setIdVariant([...idListTMP])
    }

    function getResolutionBRW() {
        var imgRect: any = document.getElementById('imgRect');
        var width: number = imgRect.clientWidth;
        var height: number = imgRect.clientHeight;
        let newRes = resolutionBRW;
        newRes[0] = width - 1;
        newRes[1] = height - 1;
        setResolutionBRW([...newRes]);
    }

    function getResolution() {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            let newRes = resolutionIMG;
            newRes[0] = img.width;
            newRes[1] = img.height;
            setResolutionIMG([...newRes]);
        }
    }

    useEffect(() => {
        let aux: string[] = [];
        if (detail !== null && url === "") {
            aux = detail.screenshotsPath.split("/");
            getScreenshot(token ?? "", aux[aux.length - 1] + "/" + screenshot_filename);
        }
        seedVariants();
        getResolution();
    }, []);

    function startDrag(event: any) {
        setDrawing(true)
        var x: number = (event.nativeEvent.offsetX >= 0 ? event.nativeEvent.offsetX : 0)
        var y: number = (event.nativeEvent.offsetY >= 0 ? event.nativeEvent.offsetY : 0)
        let coorTMP = [x, y, x, y]
        setCoorR([...coorTMP])
    }

    function stopDrag(event: any) {
        setDrawing(false)
    }

    function updateDraw(event: any) {
        var tx: number = event.nativeEvent.offsetX
        var ty: number = event.nativeEvent.offsetY
        if (drawing) {
            let coorTMP = coorR
            coorTMP[2] = tx
            coorTMP[3] = ty
            setCoorR([...coorTMP])
        }
    }

    function leaveRect(e: any) {
        if (drawing) {
            handleMouseLeave(e)
        }
        setDrawing(false)
    }

    function confirmRect() {
        let coorTMP = [0, 0, 0, 0]
        setCoorR([...coorTMP])
        setDrawing(false)
    }

    window.onresize = function () {
        getResolutionBRW();
        confirmRect();
    }

    function handleMouseEnter(e: any) {
        startDrag(e);
        let x: number = (e.nativeEvent.offsetX >= 0 ? e.nativeEvent.offsetX : 0)
        let y: number = (e.nativeEvent.offsetY >= 0 ? e.nativeEvent.offsetY : 0)
        let argsTMP = argumentsCoor;
        argsTMP.coordinates = [x, y, 0, 0]
        setArgumentsCoor({
            ...argsTMP
        })
    }

    function handleMouseLeave(e: any) {
        stopDrag(e);
        var tx: number = (e.nativeEvent.offsetX >= 0 ? e.nativeEvent.offsetX : 0)
        var ty: number = (e.nativeEvent.offsetY >= 0 ? e.nativeEvent.offsetY : 0)
        var x1, y1, x2, y2: number
        if (argumentsCoor.coordinates[0] <= tx) {
            x1 = argumentsCoor.coordinates[0]
        } else {
            x1 = tx
        }
        if (argumentsCoor.coordinates[1] <= ty) {
            y1 = argumentsCoor.coordinates[1]
        } else {
            y1 = ty
        }
        if (argumentsCoor.coordinates[0] > tx) {
            x2 = argumentsCoor.coordinates[0]
        } else {
            x2 = tx
        }
        if (argumentsCoor.coordinates[1] > ty) {
            y2 = argumentsCoor.coordinates[1]
        } else {
            y2 = ty
        }
        if (resolutionIMG !== resolutionBRW) {
            x1 = Math.round(resolutionIMG[0] * x1 / resolutionBRW[0])
            y1 = Math.round(resolutionIMG[1] * y1 / resolutionBRW[1])
            x2 = Math.round(resolutionIMG[0] * x2 / resolutionBRW[0])
            y2 = Math.round(resolutionIMG[1] * y2 / resolutionBRW[1])
        }
        let argsTMP = argumentsCoor;
        argsTMP.coordinates = [x1, y1, x2, y2]
        setArgumentsCoor({
            ...argsTMP
        })
    }

    const removeElement = (key: string, id: number) => {
        let screenTMP = screenshots;
        let colorTMP = randomColor;
        screenTMP[key].splice(id, 1);
        colorTMP[key].splice(id, 1);
        if (screenTMP[key].length === 0) {
            delete screenTMP[key];
            delete colorTMP[key];
        }
        setScreenshot(
            { ...screenTMP }
        )
        setRandomColor({ ...colorTMP })
    }

    function saveAndEnd() {
        if (Object.keys(screenshots).length > 0) {
            let screenTMP = screenshots;
            let screenColumn: IScreenshotColumn = {
                initValue: json_conf[variant][act].Screenshot.initValue,
                name: json_conf[variant][act].Screenshot.name,
                variate: 1,
                args: screenTMP
            };
            if (variability_mode === 'scenario') {
                dispatch(wizardSlice.actions.setScenarioConfiguration({
                    ...json_conf,
                    [variant]: {
                        ...json_conf[variant],
                        [act]: {
                            ...json_conf[variant][act],
                            ["Screenshot"]: screenColumn
                        }
                    }
                }));
            } else {
                dispatch(wizardSlice.actions.setVariabilityConfiguration({
                    ...json_conf,
                    [variant]: {
                        ...json_conf[variant],
                        [act]: {
                            ...json_conf[variant][act],
                            ["Screenshot"]: screenColumn
                        }
                    }
                }));
            }
        }
        history.push(redirect_at_end + variant + '/' + act)
    }

    function onLoadImage() {
        selectVarFuncByCat(token ?? "", "features.experiment.function_category.name.screenshot");
        selectGUICat(token ?? "");
        paramsListResults(token ?? "");
        selectElement(token ?? "");
        getResolution();
        getResolutionBRW();
        screenshotConfigured();
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

    function resizeRect(x: any, brw: any, img: any) {
        return Math.round(brw * x / img);
    }

    function handleChangeFunction(e: any) {
        let functionTMP: number = e.target.value;
        setFunction(functionTMP);
        paramsByFunction(functionTMP);
    }

    function handleChangeVariantDependency(e: any) {
        let variantTMP: string = e.target.value;
        setVarAct([variantTMP, "", ""]);
        activitiesByVariant(variantTMP)
    }

    function handleChangeActivityDependency(e: any) {
        let activityTMP: string = e.target.value;
        setVarAct([varAct[0], activityTMP, ""]);
        IDbyActivities(varAct[0], activityTMP)
    }

    function handleChangeVariantID(e: any) {
        let idTMP: string = e.target.value;
        setVarAct([varAct[0], varAct[1], idTMP]);
    }

    function handleChangeGUI(e: any) {
        let guiTMP: number = e.target.value;
        setGUIcatID(guiTMP);
        let componentsTMP = componentsByCatID(guiTMP);
        setComponents([...componentsTMP]);
    }

    const handleChangeElement = (event: SelectChangeEvent<typeof elementID>) => {
        const {
            target: { value },
        } = event;
        setElementID(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    function handleChangeFont(e: any) {
        let fontTMP: string = e.target.value;
        setFontID(fontTMP);
    }

    function addElementToTable() {
        let argumentTMP = argumentsCoor;
        let countTMP = count;
        let screenTMP = screenshots;
        if (guicatID !== 0) {
            let guiCatName: CategoryDTO = getByID(guiComponentsCat, guicatID);
            if (functionID !== 0) {
                let functionName: VariabilityFunctionDTO = getByID(variabilityFunctions, functionID);
                let paramsTMP: FunctionParamDTO[] = paramsL;
                if (guiCatName !== null && functionName !== null) {
                    argumentTMP.id = countTMP
                    if (paramsTMP.length > 0 && paramsL.length > 0) {
                        for (let j in paramsTMP) {
                            if (paramsTMP[j].function_param_category.data_type === "element") {
                                argumentTMP.args[paramsTMP[j].id_code] = elementID;
                            }
                            if (paramsTMP[j].function_param_category.data_type === "font") {
                                argumentTMP.args[paramsTMP[j].id_code] = [fontID, sizeRef.current.value, colorRef.current.value, colorBackRef.current.value]
                            }
                            if (paramsTMP[j].function_param_category.data_type === "list") {
                                argumentTMP.args[paramsTMP[j].id_code] = listRef.current.value.split(',')
                            }
                            if (paramsTMP[j].function_param_category.data_type !== "font" && paramsTMP[j].function_param_category.data_type !== "element") {
                                if ((document.getElementById(paramsTMP[j].id.toString()) as HTMLInputElement).value !== null) {
                                    argumentTMP.args[paramsTMP[j].id_code] = (document.getElementById(paramsTMP[j].id.toString()) as HTMLInputElement).value;
                                }
                            }
                        }
                    }
                    argumentTMP.name = functionName.id_code;
                    if (guiCatName !== null) {
                        let colorTMP = randomColor;
                        if (screenTMP.hasOwnProperty(guiCatName.name)) {
                            let listARGS = screenTMP[guiCatName.name!]
                            listARGS.push(argumentTMP)
                            screenTMP[guiCatName.name] = listARGS
                            let listColor = colorTMP[guiCatName.name!]
                            listColor.push("#" + Math.floor(Math.random() * 16777215).toString(16))
                            colorTMP[guiCatName.name] = listColor
                        } else {
                            screenTMP[guiCatName.name] = [argumentTMP]
                            colorTMP[guiCatName.name] = ["#" + Math.floor(Math.random() * 16777215).toString(16)]
                        }
                        setScreenshot({
                            ...screenTMP
                        })
                        setRandomColor({ ...colorTMP })
                    }
                    countTMP = countTMP + 1
                    setCount(countTMP);
                    setErrorMessage(false)
                } else {
                    setErrorMessage(true)
                }
            } else {
                let dependencyTMP: IDependency = initialDependency;
                if (guiCatName !== null && +varAct[0].trim() !== 0 && varAct[1].trim() !== "" && +varAct[2].trim() !== 0) {
                    argumentTMP.id = countTMP;
                    argumentTMP.name = ""
                    dependencyTMP.id = +varAct[2].trim()
                    dependencyTMP.Activity = varAct[1].trim()
                    dependencyTMP.V = +varAct[0].trim()
                    argumentTMP.args_dependency = dependencyTMP;
                    if (guiCatName !== null) {
                        let colorTMP = randomColor;

                        if (screenTMP.hasOwnProperty(guiCatName.name)) {
                            let listARGS = screenTMP[guiCatName.name!]
                            listARGS.push(argumentTMP)
                            screenTMP[guiCatName.name] = listARGS
                            let listColor = colorTMP[guiCatName.name!]
                            listColor.push("#" + Math.floor(Math.random() * 16777215).toString(16))
                            colorTMP[guiCatName.name] = listColor
                        } else {
                            screenTMP[guiCatName.name] = [argumentTMP]
                            colorTMP[guiCatName.name] = ["#" + Math.floor(Math.random() * 16777215).toString(16)]

                        }
                        setScreenshot({
                            ...screenTMP
                        })
                        setRandomColor({ ...colorTMP })
                    }
                    countTMP = countTMP + 1
                    setCount(countTMP);
                    setErrorMessage(false)
                } else {
                    setErrorMessage(true)
                }
            }
        } else {
            setErrorMessage(true)
        }
        argumentTMP = initialArgs
        setArgumentsCoor({ ...argumentTMP });
        confirmRect();
    }

    function confirmBack() {
        if (window.confirm(t('features.experiment.assist.back'))) {
            history.push(redirect_at_end + variant + '/' + act)
        }
    }

    return (

        <>
            <Grid
                container
                direction="row"
                spacing={4}>
                <Grid xs={10} lg={10} item style={{ marginTop: theme.spacing(2) }}>
                    <Typography variant="h4">
                        <IconButton color="primary" aria-label="go back" component="span" onClick={confirmBack}>
                            <ChevronLeft />
                        </IconButton>
                        {t('features.experiment.assist.title.elementselector')}
                    </Typography>
                </Grid>
                <Grid xs={2} lg={2} item style={{ marginTop: theme.spacing(2) }}>
                    <Button name="save" variant="contained" color="primary" endIcon={<SaveIcon />} onClick={saveAndEnd} style={{ fontSize: "small", marginLeft: 4 }}>
                        {t('features.experiment.assist.next')}
                    </Button>
                </Grid>
                {errorMessage &&
                    <Grid xs={12} lg={12} item style={{ marginTop: theme.spacing(2) }}>
                        <Typography variant="h5" color="red" >
                            {t('features.experiment.assist.empty')}
                        </Typography>
                    </Grid>
                }
            </Grid>
            <Grid
                container
                direction="row"
                spacing={4}>
                <Grid xs={12} lg={8} item style={{ marginTop: theme.spacing(2) }}>
                    <Card>
                        <Box component={"div"}
                            sx={
                                {
                                    position: "relative"
                                }}>
                            {Object.keys(screenshots).length > 0 && Object.keys(screenshots).map((key, index) => (
                                Object.keys(screenshots[key]).map((key2, index2) => (
                                    < Box component={"div"}
                                        sx={{
                                            userSelect: "none",
                                            pointerEvents: "none",
                                            position: "absolute",
                                            left: resizeRect(screenshots[key][index2].coordinates[0], resolutionBRW[0], resolutionIMG[0]),
                                            top: resizeRect(screenshots[key][index2].coordinates[1], resolutionBRW[1], resolutionIMG[1]),
                                            width: resizeRect(screenshots[key][index2].coordinates[2], resolutionBRW[0], resolutionIMG[0]) - resizeRect(screenshots[key][index2].coordinates[0], resolutionBRW[0], resolutionIMG[0]),
                                            height: resizeRect(screenshots[key][index2].coordinates[3], resolutionBRW[1], resolutionIMG[1]) - resizeRect(screenshots[key][index2].coordinates[1], resolutionBRW[1], resolutionIMG[1]),
                                            outline: "2px solid black",
                                            backgroundColor: randomColor[key][index2],
                                            opacity: 0.3
                                        }}
                                    ></Box>))))
                            }
                            < Box component={"div"} id="overlay"
                                sx={{
                                    userSelect: "none",
                                    pointerEvents: "none",
                                    position: "absolute",
                                    left: (coorR[0] <= coorR[2]) ? coorR[0] : coorR[2],
                                    top: (coorR[1] <= coorR[3]) ? coorR[1] : coorR[3],
                                    width: ((Math.abs(coorR[0] - coorR[2]) <= resolutionBRW[0]) ? Math.abs(coorR[0] - coorR[2]) : 1),
                                    height: ((Math.abs(coorR[1] - coorR[3]) <= resolutionBRW[1]) ? Math.abs(coorR[1] - coorR[3]) : 1),
                                    outline: "2px solid blue",
                                    backgroundColor: "blue",
                                    opacity: 0.3
                                }}
                            ></Box>
                            < CardMedia
                                component="img"
                                id="imgRect"
                                image={url}
                                alt="mock"
                                style={{
                                    pointerEvents: "auto",
                                    height: "auto",
                                    maxWidth: "100%"
                                }}
                                onLoad={onLoadImage}
                                onMouseDown={handleMouseEnter}
                                onMouseMove={updateDraw}
                                onMouseUp={handleMouseLeave}
                                onMouseLeave={leaveRect}

                                draggable={false}
                            />

                        </Box>
                    </Card>
                </Grid>
                <Grid xs={12} lg={4} item style={{ marginTop: theme.spacing(2) }} >
                    <Card>
                        <CardContent>
                            <Box component={"div"}>
                                <Typography component="div" >
                                    {t('features.experiment.assist.function.gui_components')}:
                                </Typography>
                                <Select
                                    id="select_gui"
                                    value={guicatID}
                                    label={t('features.experiment.assist.function.gui_components')}
                                    onChange={handleChangeGUI}
                                >
                                    {Object.keys(guiComponentsCat).map((key, index) => (
                                        <MenuItem value={guiComponentsCat[index].id}>
                                            <Tooltip title={t(guiComponentsCat[index].description) + ""} placement="right">
                                                <div>
                                                    {t(guiComponentsCat[index].name)}
                                                </div>
                                            </Tooltip>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box component={"div"}>
                                <Typography component="div" >
                                    {t('features.experiment.assist.coordinates.topleft')}:{argumentsCoor.coordinates[0]}, {argumentsCoor.coordinates[1]}
                                </Typography>
                                <Typography component="div">
                                    {t('features.experiment.assist.coordinates.rightbot')}:{argumentsCoor.coordinates[2]}, {argumentsCoor.coordinates[3]}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card style={{ marginTop: theme.spacing(2) }}>
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
                                <MenuItem value={0}>{t('features.experiment.assist.function.dependency')}</MenuItem>
                                {Object.keys(variabilityFunctions).map((key, index) => (

                                    <MenuItem value={variabilityFunctions[index].id}>
                                        <Tooltip title={t(variabilityFunctions[index].description) + ""} placement="right">
                                            <div>
                                                {t(variabilityFunctions[index].function_name)}
                                            </div>
                                        </Tooltip>
                                    </MenuItem>
                                ))}
                            </Select>
                            {functionID === 0 &&
                                <Box component={"div"} style={{ marginTop: theme.spacing(2) }} >
                                    <Box component={"div"} style={{ marginTop: theme.spacing(2) }}>
                                        <Typography component="div">{t('features.experiment.assist.function.variant_dependency')}:</Typography>
                                        <Select
                                            id="select_variant"
                                            value={varAct[0]}
                                            label={t('features.experiment.assist.function.variability_function')}
                                            onChange={handleChangeVariantDependency}
                                        >
                                            {Object.keys(variantDependency).map((key, index) => (
                                                <MenuItem value={variantDependency[index]}>{variantDependency[index]}</MenuItem>
                                            ))}
                                        </Select>
                                    </Box>
                                    <Box component={"div"} style={{ marginTop: theme.spacing(2) }}>
                                        <Typography component="div">{t('features.experiment.assist.function.activity_dependency')}:</Typography>
                                        <Select
                                            disabled={+varAct[0].trim() === 0}
                                            id="select_activity"
                                            value={varAct[1]}
                                            label={t('features.experiment.assist.function.variability_function')}
                                            onChange={handleChangeActivityDependency}
                                        >
                                            {Object.keys(activityDependency).map((key, index) => (
                                                <MenuItem value={activityDependency[index]}>{activityDependency[index]}</MenuItem>
                                            ))}
                                        </Select>
                                    </Box>
                                    <Box component={"div"} style={{ marginTop: theme.spacing(2) }}>
                                        <Typography component="div">{t('features.experiment.assist.function.variant_id')}:</Typography>
                                        <Select
                                            disabled={varAct[1].trim() === ""}
                                            id="select_id_variant"
                                            value={varAct[2]}
                                            label={t('features.experiment.assist.function.variability_function')}
                                            onChange={handleChangeVariantID}
                                        >
                                            {Object.keys(idVariant).map((key, index) => (
                                                <MenuItem value={idVariant[index]}>{idVariant[index]}</MenuItem>
                                            ))}
                                        </Select>
                                    </Box>
                                </Box>}
                            {Object.keys(variabilityFunctions).map((key, index) => (
                                variabilityFunctions[index].id === functionID && paramsL.length > 0 &&
                                <Box component={"div"} style={{ marginTop: theme.spacing(2) }} >
                                    <Typography component="div" >
                                        {t('features.experiment.assist.function.params_function')}
                                    </Typography>
                                    {Object.keys(paramsL).map((key2, index2) => (
                                        <Box component={"div"}>
                                            <Typography component="div">{t(paramsL[index2].description)}:</Typography>
                                            {(paramsL[index2].function_param_category.data_type === "element") && (paramsL[index2].function_param_category.data_type !== "font") && (paramsL[index2].function_param_category.data_type !== "list") &&
                                                <Select
                                                    id="select_element"
                                                    multiple
                                                    value={elementID}
                                                    input={<OutlinedInput label={t('features.experiment.assist.function.params_function')} />}
                                                    onChange={handleChangeElement}
                                                >
                                                    {Object.keys(components).length > 0 && Object.keys(components).map((key, index) => (

                                                        <MenuItem key={components[index].id_code} value={components[index].id_code}>
                                                            <Tooltip title={t(components[index].description) + ""} placement="right">
                                                                <div>
                                                                    {t(components[index].name)}
                                                                </div>
                                                            </Tooltip>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            }
                                            {(paramsL[index2].function_param_category.data_type !== "element") && (paramsL[index2].function_param_category.data_type !== "font") && (paramsL[index2].function_param_category.data_type !== "list") &&

                                                <Tooltip title={t(paramsL[index2].description) + ""} placement="right">
                                                    <TextField id={paramsL[index2].id + ""} placeholder={t(paramsL[index2].function_param_category.placeholder)} label={t(paramsL[index2].function_param_category.label)} type={paramsL[index2].function_param_category.data_type} />
                                                </Tooltip>
                                            }
                                            {(paramsL[index2].function_param_category.data_type !== "element") && (paramsL[index2].function_param_category.data_type === "font") && (paramsL[index2].function_param_category.data_type !== "list") &&

                                                <Box component={"div"} style={{ marginTop: theme.spacing(2) }}>
                                                    <Select
                                                        id="select_font"
                                                        required={true}
                                                        value={fontID}
                                                        label={t('features.experiment.assist.function.variability_function')}
                                                        onChange={handleChangeFont}
                                                    >
                                                        <MenuItem value={'resources/Roboto-Black.ttf'}>Roboto_font</MenuItem>
                                                    </Select>
                                                    <Box component={"div"} style={{ marginTop: theme.spacing(2) }}>
                                                        <TextField id="outlined-basic" inputRef={sizeRef} label={t('features.experiment.assist.function.font_size')} variant="outlined" type="number" />
                                                    </Box>
                                                    <Box component={"div"} style={{ marginTop: theme.spacing(2) }}>
                                                        <TextField id="outlined-basic" inputRef={colorRef} label={t('features.experiment.assist.function.font_color')} variant="outlined" type="String" />
                                                    </Box>
                                                    <Box component={"div"} style={{ marginTop: theme.spacing(2) }}>
                                                        <TextField id="outlined-basic" inputRef={colorBackRef} label={t('features.experiment.assist.function.font_back_color')} variant="outlined" type="String" />
                                                    </Box>
                                                </Box>
                                            }
                                            {(paramsL[index2].function_param_category.data_type !== "element") && (paramsL[index2].function_param_category.data_type !== "font") && (paramsL[index2].function_param_category.data_type === "list") &&
                                                <Tooltip title={t(paramsL[index2].description) + ""} placement="right">
                                                    <TextField id={paramsL[index2].id + ""} inputRef={listRef} placeholder={t(paramsL[index2].function_param_category.placeholder)} label={t(paramsL[index2].function_param_category.label)} type={paramsL[index2].function_param_category.data_type} />
                                                </Tooltip>
                                            }
                                        </Box>
                                    ))}
                                </Box>
                            ))}
                            <Grid item justifyContent="center" style={{ marginTop: theme.spacing(2) }}>
                                <Button
                                    onClick={addElementToTable}
                                    variant="contained"
                                    color="secondary"
                                    style={{ fontSize: "small" }}
                                >
                                    {t('features.experiment.assist.add')}</Button>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                {Object.keys(screenshots).length > 0 &&
                    <Grid xs={12} sm={12} item style={{ marginTop: theme.spacing(2) }}>
                        <Card>
                            <TableContainer component={Paper} >
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">ID</TableCell>
                                            <TableCell align="center">{t('features.experiment.assist.element.name')}</TableCell>
                                            <TableCell align="center">{t('features.experiment.assist.element.color')}</TableCell>
                                            <TableCell align="center">{t('features.experiment.assist.element.topleft')}&nbsp;(x,y)</TableCell>
                                            <TableCell align="center">{t('features.experiment.assist.element.botright')}&nbsp;(x,y)</TableCell>
                                            <TableCell align="center">{t('features.experiment.assist.function.variability_function')}</TableCell>
                                            <TableCell align="center">{t('features.experiment.assist.delete')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {Object.keys(screenshots).length > 0 && Object.keys(screenshots).map((key, index) => (
                                        Object.keys(screenshots[key]).map((key2, index2) => (
                                            <TableBody>
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center" component="th" scope="row">
                                                        {screenshots[key][index2].id}
                                                    </TableCell>
                                                    <TableCell align="center" component="th" scope="row">
                                                        {t(key)}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{
                                                        backgroundColor: randomColor[key][index2],
                                                        opacity: 0.3
                                                    }}></TableCell>
                                                    <TableCell align="center" >{screenshots[key][index2].coordinates[0]}, {screenshots[key][index2].coordinates[1]}</TableCell>
                                                    <TableCell align="center" >{screenshots[key][index2].coordinates[2]}, {screenshots[key][index2].coordinates[3]}</TableCell>
                                                    <TableCell align="center" >{t(screenshots[key][index2].name === "" ? 'features.experiment.assist.function.dependency' : screenshots[key][index2].name)}</TableCell>
                                                    <TableCell align="center" >
                                                        <Button variant="contained" color="secondary" onClick={() => removeElement(key, index2)}>
                                                            {t('features.experiment.assist.delete')}
                                                        </Button></TableCell>
                                                </TableRow>
                                            </TableBody>))))}
                                </Table>
                            </TableContainer>
                        </Card>
                    </Grid>
                }
            </Grid >
        </>
    )
}
export default ExperimentGetGUIComponentsCoordenates;
