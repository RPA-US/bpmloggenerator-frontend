import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material'; 
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { authSelector } from 'features/auth/slice';
import BackButton from 'components/BackButton';
import UserForm from './Form';
import GUIComponentsCatalog from './GUIComponentsCatalog';

import GUIComponentRepository from 'infrastructure/repositories/gui-component';
import GUIComponentCategoryRepository from 'infrastructure/repositories/gui-component-category';
import { updateUser } from 'features/auth/slice';
import { GUIComponentCategoryType, GUIComponentType } from './GUIComponentsCatalog/types';
import { guiComponentDTOToGUIComponent } from './utils';
import { GUIComponentResponse } from 'infrastructure/http/dto/wizard';

const guiComponentRepository = new GUIComponentRepository();
const guiComponentCategoryRepository = new GUIComponentCategoryRepository();

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { currentUser, token, isLoading } = useSelector( authSelector );

  const [ categories, setCategories ]: [ GUIComponentCategoryType[], any] = useState([]);
  const [ components, setComponents ]: [ GUIComponentType[], any] = useState([]);
;
  useEffect(() => {
    guiComponentCategoryRepository.list(token ?? '')
      .then((categoriesData) => {
        console.log('components categories', categoriesData);
        const categories = (categoriesData.results ?? [])
          .map((category: any) => ({
            ...category,
            name: t(category.name),
            description: t(category.description)
          } as GUIComponentCategoryType));
        setCategories(categories);
      });

    guiComponentRepository.ownedByUser(token ?? '')
      .then((guiComponentsResponse:GUIComponentResponse) => {
        console.log('gui components data', guiComponentsResponse);
        setComponents(guiComponentsResponse.results.map(guiComponent => guiComponentDTOToGUIComponent(guiComponent)))
      })
  }, [])

  return (
    <>
      <Typography variant="h5">
        <BackButton />
        { t('features.user.profileView') }
      </Typography>

      { /* USER FORM */ }
      <UserForm 
        onSubmit={ (data: any) => {
          console.log('submitted user form!', [...data.entries()]);
          dispatch(updateUser(data));
        } }
        disabled={ isLoading }
        initialValues={ currentUser }
      />

      { /* GUI Components catalog */}
      <GUIComponentsCatalog
        disabled={ isLoading }
        components= { components }
        categories={ categories }
        
        onComponentAdd={ (component: GUIComponentType) => {
          console.log('on component add', component);          
          setComponents([
            ...components,
            component
          ]);
        } }
        
        onComponentChange={ (component: GUIComponentType) => {
          console.log('on component change', component)
          setComponents(
            components.map((comp) => comp.id === component.id ? component : comp)
          );
        } }

        onComponentRemove={ (component: any) => {
          console.log('on component remove', component)
          setComponents(
            components.filter((comp) => comp.id === component.id)
          );
        } }
      />
    </>
  );
}

export default Profile