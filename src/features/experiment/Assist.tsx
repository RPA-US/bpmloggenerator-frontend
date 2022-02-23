import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@emotion/react';
import { Card, CardContent, Theme, Typography, Grid, CardMedia } from '@mui/material';

const ExperimentAssist: React.FC = () => {
    const { t } = useTranslation();
    const theme = useContext(ThemeContext) as Theme;
    const [coordenates, setCoordenates] = useState({x0:0,y0:0, x1: 0, y1: 0 ,x2:0 , y2:0 });

    const handleMouseEnter = (e: any) => {
         var x: number = (e.nativeEvent.offsetX>=0 ? e.nativeEvent.offsetX:0)
         var y: number = (e.nativeEvent.offsetY>=0 ? e.nativeEvent.offsetY:0)
        setCoordenates({
            ...coordenates,
            x1:x,
            y1:y
          })
    }
    const handleMouseLeave = (e: any) => {
        var tx: number = (e.nativeEvent.offsetX>=0 ? e.nativeEvent.offsetX:0)
        var ty: number = (e.nativeEvent.offsetY>=0 ? e.nativeEvent.offsetY:0)
        var x1,y1,x2,y2: number
        if (coordenates.x1<=tx){
            x1 = coordenates.x1
        }else{
            x1 = tx
        }
        if (coordenates.y1<=ty){
            y1 = coordenates.y1
        }else{
            y1 = ty
        }
        if (coordenates.x1>tx){
            x2 = coordenates.x1
        }else{
            x2 = tx
        }
        if (coordenates.y1>ty){
            y2 = coordenates.y1
        }else{
            y2 = ty
        }
        setCoordenates({
            ...coordenates,
            x1:x1,
            y1:y1,
            x2:x2,
            y2:y2
          })
    }
    const handleMouseMove = (e: any) => {
        var x: number = (e.nativeEvent.offsetX>=0 ? e.nativeEvent.offsetX:0)
        var y: number = (e.nativeEvent.offsetY>=0 ? e.nativeEvent.offsetY:0)
        setCoordenates({
            ...coordenates,
            x0:x,
            y0:y
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
                        onMouseDown={handleMouseEnter}
                        onMouseUp={handleMouseLeave}
                        draggable={false}
                    />
                </Card>
            </Grid>

        </>
    )
}

export default ExperimentAssist;