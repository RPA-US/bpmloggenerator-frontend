import React, { useContext, useState } from 'react';
import { Button, Card, CardContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Modal, Select, Theme, Typography } from "@mui/material";
import { ThemeContext } from '@mui/styled-engine';
import { useTranslation } from 'react-i18next';

import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import CenteredModal from 'components/CenteredModal';

import GUIComponentsList from './List';
import { GUIComponentCategoryType, GUIComponentType } from './types';
import CreateGUIComponentForm from './Form';


export interface GUIComponentsCatalogProps {
  disabled: boolean
  components: GUIComponentType[]
  categories: GUIComponentCategoryType[]
  onComponentAdd: Function
  onComponentChange: Function
  onComponentRemove: Function
}

const GUIComponentsCatalog: React.FC<GUIComponentsCatalogProps> = (props) => {
  const theme = useContext(ThemeContext) as Theme;
  const { t } = useTranslation();
  const [ category, setCategory ]: [GUIComponentCategoryType, any] = useState({} as GUIComponentCategoryType);

  const [ creationModal, setCreationModal ] = useState(false);

  const [ guiComponentsLoading, setGUIComponentsLoading ] = useState(false);

  const [ initialValues, setInitialValues ] = useState({});

  const { disabled, categories, components } = props;

  return (<div>
    <Card
      style={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(4) }}
      component="form"
      noValidate
      autoComplete="off"
    >
      <CardContent>

        <Grid container alignItems="center" justifyContent="space-around">
          <Grid item xs={6}>
            <Typography style={{ display: 'inline-block' }}  variant="h6">GUI Components catalog</Typography>

            <div style={{
              width: '200px',
              display: 'inline-block',
              verticalAlign: 'middle',
              marginLeft: theme.spacing(4)
            }}>
              <FormControl fullWidth={ true }>
                <InputLabel id="category-select">
                  { t('features.user.gui-components.category') }
                </InputLabel>
                <Select
                  labelId="category-select"
                  label={ t('features.user.gui-components.category') }
                  value={ category.id ?? '' }
                  disabled={ disabled || categories.length === 0 }
                  onChange={ (evt: any) =>  {
                    const categoryId = evt.target.value;
                    const category = categories.find(cat => cat.id === categoryId);
                    setCategory(category as any);
                  }}
                >
                  { categories.length > 0 && categories.map((category, i) => (
                    <MenuItem 
                      key={i}
                      value={ category.id }
                    >{ category.name }</MenuItem>
                  )) }
                </Select>
              </FormControl>
            </div>

            { category.id != null && (
            <IconButton
              style={{ 
                display: 'inline-block',
                verticalAlign: 'middle'
              }}
              onClick={ () => setCategory({} as GUIComponentCategoryType) }
            >
              <ClearIcon />
            </IconButton>) }
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Button 
              name="addGUIComponent"
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={ () => {
                setInitialValues({});
                setCreationModal(true) 
              }}
            >
              { t('features.user.gui-components.addComponent') }
            </Button>
          </Grid>
        </Grid>

        <GUIComponentsList
          components={ components.filter(comp => {
            return category?.id == null || category.id === comp.category
          }) }
          categories={ categories }
          style={{ marginTop: theme.spacing(2) }}
          onSelect={ (component: GUIComponentType) => {
            setInitialValues(component);
            setCreationModal(true);
          }}
        />

      </CardContent>

    </Card>

    { /* GUI Component creation modal */ }
    <CenteredModal
      opened={ creationModal }
      onClose={ () => setCreationModal(false) }
      titleId="modal-gui-component-creation"
    >
      <Typography id="modal-gui-component-creation" variant="h6" component="h2">
        { t('features.user.gui-components.form.title') }
      </Typography>

      <CreateGUIComponentForm
        onSubmit={ (guiComponentData: any) => {
          console.log('TODO: handle gui component creation form submit', guiComponentData);

            // temp method to add and display saved gui-component
          if (typeof (initialValues as any).id === 'number') {
            props.onComponentChange({
              ...initialValues,
              name: guiComponentData.get('name'),
              category: parseInt(guiComponentData.get('category')),
              description: guiComponentData.get('description'),
              path: (initialValues as any).path,
              filename: (guiComponentData.get('thumbnail') || [])[0]?.name || (initialValues as any).filename,
            })
          } else {
            props.onComponentAdd({
              id: Math.round(Math.random() * 1000),
              name: guiComponentData.get('name'),
              category: parseInt(guiComponentData.get('category')),
              description: guiComponentData.get('description'),
              path: 'some/random/string',
              filename: guiComponentData.get('thumbnail').name,
            });
          }

          setCreationModal(false);
          setInitialValues({});

        }}
        disabled={ guiComponentsLoading }
        categories={ categories }
        initialValues={ initialValues }
      />
    </CenteredModal>

  </div>)
}

export default GUIComponentsCatalog;