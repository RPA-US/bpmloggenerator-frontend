import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Theme, styled, Alert, AlertTitle, AlertColor, Collapse, IconButton, Paper } from '@mui/material';
import { ThemeContext } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';

import { notificationsSelector, hideNotification, removeNotification } from './slice';
import { NotificationType, Notification } from './types';
import { NotificationAlert } from './notification';
import { Link } from 'react-router-dom';

const alertTypeByNotificationType = (notificationType: NotificationType): AlertColor => {
  switch(notificationType) {
    case NotificationType.SUCCESS:
      return 'success';
    case NotificationType.ERROR:
      return 'error';
    case NotificationType.WARNING:
      return 'warning';
    case NotificationType.SUCCESS:
    default:
      return 'success';
  }
}

const AlertContainer = styled('div')(({ theme }) => ({

}));

const NotificationsBoard: React.FC = () => {
  const theme = useContext(ThemeContext) as Theme;
  const { list } = useSelector(notificationsSelector);
  const dispatch = useDispatch();
  const [ visibility, setVisibility ] = useState<string[]>([])

  useEffect(() => {
    console.log('list changed!', list)
    debugger;
    if (visibility.length !== list.length) {
      setVisibility(
        (list as any[])
          .filter(n => n.visible === true)
          .map(n => n.id)
        );
    }
  }, [list]);

  return (<div>
    { list.length > 0 && list.map((notification, i) => (
      <Collapse key={i} in={visibility.includes(notification.id ?? '')}>
        <Paper elevation={ 4 } style={{ marginTop: theme.spacing(3) }}>
          <AlertContainer>
            <Alert 
              severity={ alertTypeByNotificationType(notification.type) }
              action={
                notification.dismissible && (
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      dispatch(removeNotification(notification as NotificationAlert));
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                )
              }
            >
              <AlertTitle>
                { typeof notification.link === 'string' 
                  ? (<Link to={ notification.link }>{ notification.title }</Link>)
                  : (<>{  notification.title }</>)
                }
              </AlertTitle>
              { notification.subtitle != null &&  notification.subtitle }
            </Alert>
          </AlertContainer>
        </Paper>
      </Collapse>
    )) }    
  </div>)
}

export default NotificationsBoard;