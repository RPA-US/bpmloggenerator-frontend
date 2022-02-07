import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";

import alert from 'features/alert/slice';
import auth from 'features/auth/slice';
import experiment from 'features/experiment/slice';

export default function configureRootReducer(history: any) {
  return combineReducers({
    alert,
    auth,
    experiment,
    router: connectRouter(history),
  });
}