import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Button, Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import { authSelector, updateRedirectPath, checkSession, logout } from 'features/auth/slice';

const UserMenu: React.FC = ({ children }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [ anchorEl, setAnchorEl ] = useState(null); 

  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={ handleClick }
      >
        { children }
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuList>
          <MenuItem
            onClick={ () => {
              setAnchorEl(null);
              history.push('/profile');
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{ t('features.user.profileView') }</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={ () => {
              setAnchorEl(null);
              dispatch(logout);
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{ t('features.user.logout') }</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
};

export default UserMenu;