import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { Box, TextField, Card, CardContent, Theme, Typography, Grid, CardMedia } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

interface ICoordinates {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    resolutionIMG: Array<Number>,
    randomColor: string
}


const ExperimentScreenConfAssist: React.FC = () => {
    const { t } = useTranslation();
    const theme = useContext(ThemeContext) as Theme;
    const textRef = useRef<any>('');
    const url = process.env.PUBLIC_URL + "example_image.png";//cambiar a la url real
    const [resolutionBRW, setResolution] = useState([0, 0]);

    window.onresize = function () {
        var imgRect: any = document.getElementById('imgRect');
        var width: number = imgRect.clientWidth;
        var height: number = imgRect.clientHeight;
        let newRes = resolutionBRW;
        newRes[0] = width;
        newRes[1] = height;
        setResolution([...newRes]);
    }

    function resizeRect(x: any, brw: any, img: any) {
        return Math.round(brw * x / img);
    }

    return (
        <>
            <Typography variant="h4">
                {t('features.experiment.assist.title.elementselector')}
            </Typography>
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
                                id="overlay"
                                sx={
                                    {
                                        position: "absolute"
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
                                draggable={false}
                            />
                        </Box>
                    </Card>
                </Grid>
                <Grid xs={12} lg={4} item style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} >
                    <Card>
                        <CardContent>
                            <TextField inputRef={textRef} placeholder={t('features.experiment.assist.element.name')} label={t('features.experiment.assist.element.name')} />
                            <Typography component="div" >
                                {t('features.experiment.assist.coordinates.topleft')}:
                            </Typography>
                            <Typography component="div">
                                {t('features.experiment.assist.coordinates.rightbot')}:
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} lg={4} item style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2)  }} >
                    <Card>
                        <CardContent>
                            <TextField inputRef={textRef} placeholder={t('features.experiment.assist.element.name')} label={t('features.experiment.assist.element.name')} />
                            <Typography component="div" >
                                {t('features.experiment.assist.coordinates.topleft')}:
                            </Typography>
                            <Typography component="div">
                                {t('features.experiment.assist.coordinates.rightbot')}:
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} lg={4} item style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} >
                    <Card>
                        <CardContent>
                            <TextField inputRef={textRef} placeholder={t('features.experiment.assist.element.name')} label={t('features.experiment.assist.element.name')} />
                            <Typography component="div" >
                                {t('features.experiment.assist.coordinates.topleft')}:
                            </Typography>
                            <Typography component="div">
                                {t('features.experiment.assist.coordinates.rightbot')}:
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid >
        </>
    )
}

export default ExperimentScreenConfAssist;