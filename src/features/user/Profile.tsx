import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material'; 
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { authSelector } from 'features/auth/slice';
import BackButton from 'components/BackButton';
import CenteredModal from 'components/CenteredModal';
import UserForm from './Form';
import ChangePasswordForm from './ChangePasswordForm';
import GUIComponentsCatalog from './GUIComponentsCatalog';

import GUIComponentRepository from 'infrastructure/repositories/gui-component';
import GUIComponentCategoryRepository from 'infrastructure/repositories/gui-component-category';
import { updateUser } from 'features/auth/slice';
import { GUIComponentCategoryType, GUIComponentType } from './GUIComponentsCatalog/types';
import { guiComponentDTOToGUIComponent } from './utils';
import { GUIComponentResponse } from 'infrastructure/http/dto/wizard';
import AuthRepository from 'infrastructure/repositories/auth';
import Spacer from 'components/Spacer';

const guiComponentRepository = new GUIComponentRepository();
const guiComponentCategoryRepository = new GUIComponentCategoryRepository();
const authRepository = new AuthRepository();

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { currentUser, token, isLoading } = useSelector( authSelector );

  const [ categories, setCategories ]: [ GUIComponentCategoryType[], any] = useState([]);
  const [ components, setComponents ]: [ GUIComponentType[], any] = useState([]);
  const [ pwdChangeModal, setPwdChangeModal ] = useState(false);
;
  useEffect(() => {
    guiComponentCategoryRepository.list(token ?? '')
      .then((categoriesData) => {
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
        setComponents(guiComponentsResponse.results.map(guiComponent => guiComponentDTOToGUIComponent(guiComponent)))
      })
  }, [])

  return (
    <>
      <Grid container>
        <Grid item>
          <Typography variant="h5">
            <BackButton />
            { t('features.user.profileView') }
          </Typography>
        </Grid>
        <Spacer />
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={ () => setPwdChangeModal(true) }
          >
          { t('features.user.changePassword.button') }
          </Button>
        </Grid>
      </Grid>

      { /* USER FORM */ }
      <UserForm 
        onSubmit={ (data: any) => {
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
          setComponents([
            ...components,
            component
          ]);
        } }
        
        onComponentChange={ (component: GUIComponentType) => {
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


      { /* Change Password Form */ }

      <CenteredModal
        opened={ pwdChangeModal }
        onClose={ () => setPwdChangeModal(false) }
        titleId="modal-password-change"
      >
        <Typography id="modal-password-change" variant="h6" component="h2">
          { t('features.user.changePassword.title') }
        </Typography>

        <ChangePasswordForm
          disabled={ isLoading }
          onSubmit={ async (data: FormData) => {
            try {
              const getFormField = (field: string): string => data.get(field) as string ?? '';
              const response = await authRepository.changePassword(getFormField('currentPassword'), getFormField('password'), getFormField('repeatedPassword'), token ?? '');
              console.log('change password response', response);
            } catch (ex) {
              console.error('error changing password', ex);
            } finally {
              setPwdChangeModal(false);
            }
          } }
        /> 
      </CenteredModal>
    </>
  );
}

export default Profile