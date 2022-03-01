import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";

import alert from 'features/alert/slice';
import auth, { SESSION_TOKEN_ITEM } from 'features/auth/slice';
import experiment from 'features/experiment/slice';
import wizard from 'features/experiment/wizard/slice';

const { localStorage } = window;

export default function configureRootReducer(history: any) {
  const appReducer = combineReducers({
    alert,
    wizard,
    auth,
    experiment,
    router: connectRouter(history),
  });

  const rootReducer = (state: any, action: any) => {
    if (action.type === 'auth/setLogOut') {
      localStorage.removeItem(SESSION_TOKEN_ITEM);
      return appReducer(undefined, action);
    }

    if (action.type === 'auth/setAuthSuccess') {
      localStorage.setItem(SESSION_TOKEN_ITEM, action.payload.token);
    }

    return appReducer(state, action);
  }

  return rootReducer;
}