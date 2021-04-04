import { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../utils/API';

export default function useAuth() {
  const history = useHistory();
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const initialRender = useRef(true);

  useEffect(() => {
    const username = document.cookie.replace(
      /(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    if (username) {
      setUsername(username);

      if (['/signup', '/login'].includes(history.location.pathname)) {
        history.replace('/');
      }
    } else {
      setIsAuthReady(true);
    }
  }, [history]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      setIsAuthReady(true);
    }
  }, [username]);

  const signIn = useCallback(
    (username: string, password: string) => {
      return API.post('/auth/login', { username, password }).then((res) => {
        setUsername(username);
        const state = history.location.state as { partyRoute: string };
        const partyRoute = state.partyRoute;
        partyRoute ? history.push(partyRoute) : history.replace('/');
      });
    },
    [history]
  );

  const signUp = useCallback(
    (username: string, password: string) => {
      return API.post('/auth/signup', { username, password }).then((res) => {
        setUsername(username);
        history.replace('/');
      });
    },
    [history]
  );

  const signOut = useCallback(() => {
    return API.post('/auth/logout').then((res) => {
      setUsername(null);
      history.replace('/');
    });
  }, [history]);

  return { isAuthReady, username, signIn, signOut, signUp };
}
