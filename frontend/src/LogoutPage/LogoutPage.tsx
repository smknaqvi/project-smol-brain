import { useEffect, useState } from "react";
import { BACKEND_API_URI } from "../constants";
import { Redirect } from "react-router";
import axios from "axios";

function LogoutPage() {
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    axios
      .post(BACKEND_API_URI + "/auth/logout", {}, { withCredentials: true })
      .then((res) => {
        if (mounted) setLoggedOut(true);
      })
      .catch((_) => {});
    return () => {
      mounted = false;
    };
  }, [loggedOut]);

  return (
    // Uncontrolled form, all values passed to us during handleSubmit event
    // https://reactjs.org/docs/uncontrolled-components.html
    <div id="LogoutPage">{loggedOut ? <Redirect to="/" /> : null}</div>
  );
}

export default LogoutPage;
