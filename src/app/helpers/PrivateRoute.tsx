import React, { useEffect } from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router';

export type ProtectedRouteProps = {
  auth: boolean;
  authPath: string;
  redirectPath: string;
  setRedirectPath: (path: string) => void;
} & RouteProps;

const PrivateRoute: React.FC<ProtectedRouteProps> = ({ auth, authPath, redirectPath, setRedirectPath, ...routeProps }) => {
  const currentLocation = useLocation();

  useEffect(() => {
    if (!auth) {
      setRedirectPath(currentLocation.pathname);
    }
  }, [auth, setRedirectPath, currentLocation]);

  console.log('Protected route props:  ', { auth, authPath, redirectPath, routeProps, currentLocation })
  if (auth) {
    console.log('rendering route with props: ', routeProps)
    return (<Route {...routeProps} />);
  } else {
    return (<Redirect to={{ pathname: auth ? redirectPath : authPath }} />)
  }
}

export default PrivateRoute;