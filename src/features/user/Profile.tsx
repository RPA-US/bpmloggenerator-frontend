import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Typography } from '@mui/material'; 
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { authSelector } from 'features/auth/slice';
import BackButton from 'components/BackButton';
import UserForm from './Form';
import GUIComponentsCatalog from './GUIComponentsCatalog';

import GUIComponentRepository from 'infrastructure/repositories/gui-component';
import GUIComponentCategoryRepository from 'infrastructure/repositories/gui-component-category';
import { t } from 'i18next';
import { GUIComponentCategoryType, GUIComponentType } from './GUIComponentsCatalog/types';

const guiComponentRepository = new GUIComponentRepository();
const guiComponentCategoryRepository = new GUIComponentCategoryRepository();

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, token } = useSelector( authSelector );

  const [ categories, setCategories ]: [ GUIComponentCategoryType[], any] = useState([]);
  const [ components, setComponents ]: [ GUIComponentType[], any] = useState([]);

  console.log('currentUser', currentUser);
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

    guiComponentRepository.list(token ?? '')
      .then((guiComponentsData) => {
        console.log('gui components data', guiComponentsData);

        setComponents([{
          id: 2,
          name: t('features.experiment.GUI_components.name.id_card_2'),
          description: t('features.experiment.GUI_components.description.id_card'),
          category: 2,
          thumbnail: null, // `/private-media/resources/GUI_components/dni/dni2.jpg`
          filename: 'dni2.jpg',
          // id_code: "id_card_2"
          path: 'resources/GUI_components/dni'
        }])
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
          console.log('submitted user form!', data);
        } }
        initialValues={ currentUser }
      />

      { /* GUI Components catalog */}
      <GUIComponentsCatalog
        disabled={ false }
        components= { components }
        categories={ categories }
        
        onComponentAdd={ (component: GUIComponentType) => {
          console.log('on component add', component)
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