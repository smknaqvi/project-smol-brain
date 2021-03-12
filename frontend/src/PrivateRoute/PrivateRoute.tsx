import { Box, CircularProgress } from '@material-ui/core';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAppState } from '../state';

export const PrivateRoute = ({ children, ...rest }: RouteProps, props: any) => {
  const { username, isAuthReady } = useAppState();

  if (!isAuthReady) {
    return (
      <Route {...rest}>
        <Box>
          <CircularProgress />
        </Box>
      </Route>
    );
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        username ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
