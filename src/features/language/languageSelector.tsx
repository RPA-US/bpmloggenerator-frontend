import React from 'react';
import { useTranslation } from 'react-i18next'

import { Avatar, MenuItem, Select } from '@mui/material';

import esThumbnail from 'assets/lang-thumbnails/spanish.png';
import enThumbnail from 'assets/lang-thumbnails/english.png';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const changeLanguage = (evt: any) => {          
    i18n.changeLanguage(evt.target.value);
  };

  console.log('i18n language', i18n.language)
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={ i18n.language }
      label="Age"
      onChange={ changeLanguage }
      sx={{
        '&, & .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        }
      }} 
    >
      <MenuItem value="es">
        <Avatar alt="Cindy Baker" sx={{ width: 24, height: 24 }} src={ esThumbnail } />
      </MenuItem>
      <MenuItem value="en">
        <Avatar alt="Cindy Baker" sx={{ width: 24, height: 24 }} src={ enThumbnail } />
      </MenuItem>
    </Select>
  )
}
export default LanguageSelector;