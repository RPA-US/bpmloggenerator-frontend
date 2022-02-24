import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { TextField, Button, Card, CardContent, Theme, Typography, Grid, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface ICoordinates {
    x0: number, 
    y0: number, 
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    resolutionIMG: Array<Number>, 
    resolutionBRW: Array<Number>
}

const ExperimentAssist: React.FC = () => {
    const initialCoordinates = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, resolutionIMG: [0, 0], resolutionBRW: [0, 0] };
    var initialElements: { [name: string]: ICoordinates; } = {};
    const { t } = useTranslation();
    const theme = useContext(ThemeContext) as Theme;
    const [coordinates, setcoordinates] = useState(initialCoordinates);
    const [elements, setElements] = useState(initialElements);
    const url = process.env.PUBLIC_URL + "example_image.png";
    const textRef = useRef();
    
    const getResolution = () => {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            setcoordinates({
                ...coordinates,
                resolutionIMG: [img.width, img.height]
            })
        }
    }

    const getBrowserResolution = (e: any) => {
        var width = e.currentTarget.clientWidth
        var height = e.currentTarget.clientHeight;
        setcoordinates({
            ...coordinates,
            resolutionBRW: [width, height]
        })
    }

    const setCoordenatesByResolution = (list: any) => {
        var resIMG = coordinates.resolutionIMG;
        var resBRW = coordinates.resolutionBRW;
        if (resIMG !== resBRW) {
            list.x1 = Math.round(resIMG[0] * list.x1 / resBRW[0])
            list.y1 = Math.round(resIMG[1] * list.y1 / resBRW[1])
            list.x2 = Math.round(resIMG[0] * list.x2 / resBRW[0])
            list.y2 = Math.round(resIMG[1] * list.y2 / resBRW[1])
        }
        setcoordinates({
            ...coordinates,
            x1: list.x1,
            y1: list.y1,
            x2: list.x2,
            y2: list.y2
        })
    }

    const handleMouseEnter = (e: any) => {
        var x: number = (e.nativeEvent.offsetX >= 0 ? e.nativeEvent.offsetX : 1)
        var y: number = (e.nativeEvent.offsetY >= 0 ? e.nativeEvent.offsetY : 1)
        setcoordinates({
            ...coordinates,
            x1: x,
            y1: y
        })
    }

    const handleMouseLeave = (e: any) => {
        var tx: number = (e.nativeEvent.offsetX > 0 ? e.nativeEvent.offsetX : 1)
        var ty: number = (e.nativeEvent.offsetY > 0 ? e.nativeEvent.offsetY : 1)
        var x1, y1, x2, y2: number
        if (coordinates.x1 <= tx) {
            x1 = coordinates.x1
        } else {
            x1 = tx
        }
        if (coordinates.y1 <= ty) {
            y1 = coordinates.y1
        } else {
            y1 = ty
        }
        if (coordinates.x1 > tx) {
            x2 = coordinates.x1
        } else {
            x2 = tx
        }
        if (coordinates.y1 > ty) {
            y2 = coordinates.y1
        } else {
            y2 = ty
        }
        setCoordenatesByResolution({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        })
    }

    const handleMouseMove = (e: any) => {
        var x: number = (e.nativeEvent.offsetX >= 0 ? e.nativeEvent.offsetX : 1)
        var y: number = (e.nativeEvent.offsetY >= 0 ? e.nativeEvent.offsetY : 1)
        setcoordinates({
            ...coordinates,
            x0: x,
            y0: y
        })
    }
    const removeElement = (key: string) => {
        var elementsCopy = elements;
        delete elementsCopy[key];
        console.log(elementsCopy)
        setElements(elementsCopy);
        console.log(elements)

    }
    return (
        <>
            <Typography variant="h4">
                {t('features.experiment.assist.title.elementselector')}
            </Typography>
            <Grid container spacing={4}>
                <Card style={{ display: 'flex', marginTop: theme.spacing(4) }}>
                    <CardContent onMouseEnter={(e: any) => handleMouseEnter}
                        onMouseLeave={(e: any) => handleMouseLeave}>
                        <TextField inputRef={textRef} id="outlined-basic" label={t('features.experiment.assist.element.name')} variant="outlined" />
                        <Typography variant='caption' component="div" >
                            {t('features.experiment.assist.coordinates.topleft')}:{coordinates.x1}, {coordinates.y1}
                        </Typography>
                        <Typography variant='caption' component="div">
                            {t('features.experiment.assist.coordinates.rightbot')}:{coordinates.x2}, {coordinates.y2}
                        </Typography>
                        <Grid container justifyContent="center" style={{ marginTop: theme.spacing(3) }}>
                            <Button variant="contained" color="secondary" onClick={setElements()}>
                                {t('features.experiment.assist.add')}
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
                <Card style={{ display: 'flex', marginTop: theme.spacing(4) }}>
                    <CardMedia
                        component="img"
                        image={url}
                        alt="mock"
                        style={{
                            height: "auto",
                            maxWidth: "75%"
                        }}
                        onLoad={getResolution}
                        onClick={getBrowserResolution}
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseEnter}
                        onMouseUp={handleMouseLeave}
                        draggable={false}
                    />
                </Card>
            </Grid>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">{t('features.experiment.assist.element.name')}</TableCell>
                            <TableCell align="right">{t('features.experiment.assist.element.topleft')}&nbsp;(x,y)</TableCell>
                            <TableCell align="right">{t('features.experiment.assist.element.botright')}&nbsp;(x,y)</TableCell>
                            <TableCell align="right">{t('features.experiment.assist.delete')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(elements).map((key, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {key}
                                </TableCell>
                                <TableCell align="right">{elements[key].x1}, {elements[key].y1}</TableCell>
                                <TableCell align="right">{elements[key].x2}, {elements[key].y2}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" color="secondary" onClick={() => removeElement(key)}>
                                        {t('features.experiment.assist.delete')}
                                    </Button></TableCell>
                            </TableRow>
                        ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>{/**/}

        </>
    )

}

export default ExperimentAssist;