import { configureStore, Action } from '@reduxjs/toolkit';
import thunk, { ThunkAction } from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import logger from 'redux-logger';

import rootReducer from './rootReducer';

export const history: any = createBrowserHistory();


const reducer = rootReducer(history);

const middleware = [
  routerMiddleware(history),
  logger,
  thunk,
]

const store = configureStore({
  reducer,
  middleware,
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer);
  })
}

export default store;

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export type RootState = ReturnType<typeof reducer>;