import React, { SetStateAction, SyntheticEvent, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext, useTheme } from '@emotion/react';
import { Card, CardContent, Theme, Typography, Grid, CardMedia, Box } from '@mui/material';

const ExperimentAssist: React.FC = () => {
    const { t } = useTranslation();
    const theme = useContext(ThemeContext) as Theme;
    const [coordenates, setCoordenates] = useState({x0:0,y0:0, x1: 0, y1: 0 ,x2:0 , y2:0 });

    const handleMouseEnter = (e: any) => {
        setCoordenates({
            ...coordenates,
            x1:e.nativeEvent.offsetX,
            y1:e.nativeEvent.offsetY
          })
    }
    const handleMouseLeave = (e: any) => {
        setCoordenates({
            ...coordenates,
            x2:e.nativeEvent.offsetX,
            y2:e.nativeEvent.offsetY
          })

    }
    const handleMouseMove = (e: any) => {
        setCoordenates({
            ...coordenates,
            x0:e.nativeEvent.offsetX,
            y0:e.nativeEvent.offsetY
          })
    }


    return (
        <>
            <Typography variant="h4">
                {t('features.experiment.assist.title.elementselector')}
            </Typography>
            <Grid container spacing={4}>
                <Card style={{ display: 'flex', marginTop: theme.spacing(4) }}>

                    <CardContent                         onMouseEnter={(e: any) => handleMouseEnter}
                        onMouseLeave={(e: any) => handleMouseLeave}>
                        <Typography component="div" variant="h5">
                            {t('features.experiment.assist.coordenates.coordenates')}:{coordenates.x0}, {coordenates.y0}
                        </Typography>
                        <Typography variant='caption' component="div" >
                            {t('features.experiment.assist.coordenates.topleft')}:{coordenates.x1}, {coordenates.y1}
                        </Typography>
                        <Typography variant='caption' component="div">
                            {t('features.experiment.assist.coordenates.rightbot')}:{coordenates.x2}, {coordenates.y2}
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        image={process.env.PUBLIC_URL + "example_image.png"}
                        alt="mock"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                </Card>
            </Grid>

        </>
    )
}

export default ExperimentAssist;