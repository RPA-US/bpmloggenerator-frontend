import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';

import NotificationFactory from './notification';
import { showNotification } from './slice';
import { useDispatch } from 'react-redux';

const NotificationsTester: React.FC = () => {
  const dispatch = useDispatch();

  return (<Card>
    <CardContent>
      <Typography variant="h6">Notifications tester module</Typography>

      <hr />

      <Button variant="contained" onClick={ () => {
        const notification = NotificationFactory.success(`Success dismissible notification ${Math.floor(Date.now() / 1000)}`, 'optional subtitle')
          .dismissible()
          .build();

        dispatch(showNotification(notification));
      } }> Create success dismissible </Button>
    </CardContent>
  
  </Card>)
}

export default NotificationsTester;