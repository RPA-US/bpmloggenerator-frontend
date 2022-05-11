import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk, RootState } from 'store/store';
import { NotificationAlert } from './notification';
import { NotificationsState, Notification } from './types';

const initialState: NotificationsState =  {
  list: [],
}

function getNotificationId(ids: string[]): string {
  let id: string;
  do {
    id = (Math.random() + 1).toString(36).substring(5) as string;
  } while (ids.some(existingId => existingId === id));
  return id;
}

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, { payload } : PayloadAction<NotificationAlert>) {
      const ids: string[] = state.list.map(n => n.id ?? '');
      const notification = payload;
      if (notification.id == null) {
        notification.id = getNotificationId(ids);
      }

      if (ids.every(existingId => existingId !== notification.id)) {
        state.list.push(notification as Notification)
      }
    },
    removeNotification(state, { payload } : PayloadAction<NotificationAlert|string>) {
      let notificationId = (payload as Notification).id ?? payload;

      const index = state.list.findIndex(n => n.id === notificationId);
      if (index >= 0) {
        state.list.splice(index, 1);
      }
    },
    showNotificationAction(state, { payload }: PayloadAction<NotificationAlert|string>) {
      let notificationId = (payload as Notification).id ?? payload;
      const notificationIndex = state.list.findIndex(n => n.id === notificationId);
      if (notificationIndex != null) {
        state.list[notificationIndex].visible = true;
        // notification.hideCallback = hideCallback;
      }
    },
    hideNotificationAction(state, { payload }: PayloadAction<NotificationAlert|string>) {
      let notificationId = (payload as Notification).id ?? payload;
      const index = state.list.findIndex(n => n.id === notificationId);
      if (index >= 0) {
        state.list = state.list.map((n, i) => {
          if (i === index) n.visible = false;
          return n;
        });
        // notification.hideCallback = hideCallback;
      }
    }
  }
});

const { addNotification, removeNotification, showNotificationAction, hideNotificationAction } = notificationsSlice.actions;

export { addNotification, removeNotification };


export const showNotification = (notification: NotificationAlert, hideCallback?: Function): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { notifications } = getState();
  debugger;
  if (notification.id == null || notifications.list.every((n: Notification) => n.id !== notification.id)) {
    dispatch(addNotification(notification));
  }

  dispatch(showNotificationAction(notification));
}

export const hideNotification = (notification: NotificationAlert): AppThunk => async (dispatch: AppDispatch) => {
  dispatch(hideNotificationAction(notification));
}


export const notificationsSelector = (state: RootState) => state.notifications;

export default notificationsSlice.reducer;