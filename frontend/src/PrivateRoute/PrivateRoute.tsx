import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAppState } from '../state';

export const PrivateRoute = ({ children, ...rest }: RouteProps) => {
  const { username } = useAppState();
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
