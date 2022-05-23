import { Grid } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';


import GUIComponent from './Component';
import { GUIComponentCategoryType, GUIComponentType } from './types';


export interface GUIComponentsListProps {
  components: GUIComponentType[]
  categories: GUIComponentCategoryType[]
  style?: React.CSSProperties
  onSelect?: Function
}

const GUIComponentsList: React.FC<GUIComponentsListProps> = (props) => {
  const { t } = useTranslation();
  const { components, categories, style, onSelect } = props;
  return (
  <Grid container spacing={3} alignItems="stretch" style={ style }>

    { components.length === 0 && (
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        { t('features.user.gui-components.empty') }
      </Grid>
    )}

    { components.length > 0 && components.map((component, i) => (
      <Grid item key={i} xs={12} md={3} xl={2}>
        <GUIComponent
          categories={ categories }
          onClick={ () => onSelect != null && onSelect(component)  }
          id={ component.id }
          idCode={ component.idCode } 
          name={ component.name }
          description={ component.description }
          category={ component.category}
          thumbnail={ component.thumbnail }
          filename={ component.filename }
          path={ component.path }
        />
      </Grid>
    )) }

  </Grid>
  )
}

export default GUIComponentsList;