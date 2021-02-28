import { Button, TextField } from "@material-ui/core";
import { SyntheticEvent, useEffect, useState } from "react";
import { BACKEND_API_URI } from "../constants";
import { Redirect } from "react-router";
import axios from "axios";

function LoginPage() {
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {});

  function handleSubmit(e: React.SyntheticEvent) {
    // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;
    axios
      .post(
        BACKEND_API_URI + "/auth/login",
        { username, password },
        { withCredentials: true }
      )
      .then((res) => {
        setLoginStatus(true);
      })
      .catch((err) => {
        setLoginStatus(false);
      });
  }

  return (
    // Uncontrolled form, all values passed to us during handleSubmit event
    // https://reactjs.org/docs/uncontrolled-components.html
    <div id="LoginPage">
      {loginStatus ? <Redirect to="/" /> : null}
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField id="username" label="Username" />
        <TextField id="password" type="password" label="Password" />
        <Button color="primary" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
