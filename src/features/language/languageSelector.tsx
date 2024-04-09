import React from 'react';
import { useTranslation } from 'react-i18next'

import { Avatar, MenuItem, Select } from '@mui/material';

import esThumbnail from 'assets/lang-thumbnails/spanish.png';
import enThumbnail from 'assets/lang-thumbnails/usa.png';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const changeLanguage = (evt: any) => {          
    i18n.changeLanguage(evt.target.value);
  };

  // initial value checker
  if (!['en', 'es'].some(lang => i18n.language === lang)) {
    if (i18n.language.startsWith('es'))
      changeLanguage({target: { value: 'es' }});
    else
    changeLanguage({target: { value: 'en' }});
  } 

  return (
    <Select
      value={ i18n.language }
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