import { useEffect, useState } from 'react';
import { BACKEND_API_URI } from '../constants';
import { Redirect } from 'react-router';
import axios from 'axios';

function LogoutPage() {
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    axios
      .post(BACKEND_API_URI + '/auth/logout', {}, { withCredentials: true })
      .then((res) => {
        if (mounted) setLoggedOut(true);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [loggedOut]);

  // Uncontrolled form, all values passed to us during handleSubmit event
  // https://reactjs.org/docs/uncontrolled-components.html
  return loggedOut ? <Redirect to="/" /> : null;
}

export default LogoutPage;
