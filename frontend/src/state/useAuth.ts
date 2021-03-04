import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../utils/API';

export default function useAuth() {
  const history = useHistory();
  const [username, setUsername] = useState<string | null>(null);

  const signIn = useCallback(
    (username: string, password: string) => {
      return API.post('/auth/login', { username, password }).then((res) => {
        setUsername(username);
        history.replace('/');
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
      history.replace('/login');
    });
  }, [history]);

  return { username, signIn, signOut, signUp };
}
