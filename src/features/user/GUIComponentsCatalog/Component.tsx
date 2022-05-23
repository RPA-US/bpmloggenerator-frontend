import React, { useContext, useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Theme, Typography } from '@mui/material';
import { ThemeContext } from '@mui/styled-engine';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ScreenshotRepository from 'infrastructure/repositories/image';
import { authSelector } from 'features/auth/slice';
import { GUIComponentCategoryType, GUIComponentType } from './types';

function imageToURL(data: Blob | string): string {
  if (typeof data === 'string') {
    return data;
  }
  return URL.createObjectURL(data);
}

export interface GUIComponentProps extends GUIComponentType {
  onClick?: React.EventHandler<any>
  categories: GUIComponentCategoryType[]
}

const screenshotRepository = new ScreenshotRepository();

const GUIComponent: React.FC<GUIComponentProps> = (props) => {
  const theme = useContext(ThemeContext) as Theme;
  const { t } = useTranslation();
  const { categories, name, description, category, thumbnail, filename, path, onClick } = props;

  const { token } = useSelector(authSelector);

  const [ alt, setAlt ] = useState('loading');
  const [ src, setSrc ] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let blob;
        if (thumbnail == null) {
          blob = await screenshotRepository.get(path ?? '', token ?? '');
        } else {
          blob = thumbnail;
        }
        const objectURL = URL.createObjectURL(blob);

        console.log("blob: ", blob);
        
        setSrc(objectURL)
        setAlt(`${name} thumbnail`);
      } catch (ex) {
        console.error('error loading private image', ex);
        setAlt('error');
      }
    })()
  }, []);

  return (
    <Card
      onClick={ (evt) => onClick != null && onClick(evt) }
      style={{ height: '100%' }}
    >
      <CardMedia
        component="img"
        height="140"
        image={ src }
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          { name }
        </Typography>
        <Typography gutterBottom variant="caption" component="span">
          { t('features.user.gui-components.category') }
        </Typography>
        <Typography variant="caption" style={{ marginLeft: '4px', fontWeight: 'bold' }}>
            { categories.find(cat => cat.id === category)?.name ?? '' }
        </Typography>

        { typeof description === 'string' && (
          <Typography variant="body2" style={{ marginTop: theme.spacing(1) }}>
          { description }
          </Typography>
        ) }
      </CardContent>
    </Card>

  );
};

export default GUIComponent;