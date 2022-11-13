import React, { Fragment, useState } from "react";
import Alert from "./Alert";
import Input from "./form-components/Input";

export default function LoginFunc(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ type: "d-none", message: "" });
  const [errors, setErrors] = useState([]);

  function handleEmailChange(evt) {
    let value = evt.target.value;
    setEmail(value);
  }

  const handlePasswordChange = (evt) => {
    let value = evt.target.value;
    setPassword(value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    let errors = [];
    if (email === "") {
      errors.push("email");
    }
    if (password === "") {
      errors.push("password");
    }

    setErrors(errors);
    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(evt.target);
    const payload = Object.fromEntries(data.entries());

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload),
    };

    fetch(`${process.env.REACT_APP_API_URL}/v1/admin/signin`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setAlert({
            type: "alert-danger",
            message: data.error.message,
          });
        } else {
          handleJWTChange(data.token);
          window.localStorage.setItem("jwt", JSON.stringify(data.token));
          props.history.push({ pathname: "/admin" });
        }
      });
  };

  function handleJWTChange(jwt) {
    props.handleJWTChange(jwt);
  }

  function hasError(key) {
    return errors.indexOf(key) !== -1;
  }

  return (
    <Fragment>
      <h2>Login</h2>
      <hr />
      <Alert alertType={alert.type} alertMessage={alert.message} />
      <form className="pt-3" onSubmit={handleSubmit}>
        <Input
          title={"Email"}
          type={"email"}
          name={"email"}
          handleChange={handleEmailChange}
          className={hasError("email") ? "is-invalid" : ""}
          errDiv={hasError("email") ? "text-danger" : "d-none"}
          errMsg={"Please enter a valid email address"}
        />

        <Input
          title={"Password"}
          type={"password"}
          name={"password"}
          handleChange={handlePasswordChange}
          className={hasError("password") ? "is-invalid" : ""}
          errDiv={hasError("password") ? "text-danger" : "d-none"}
          errMsg={"Please enter password"}
        />
        <hr />
        <button className="btn btn-primary">Login</button>
      </form>
    </Fragment>
  );
}
