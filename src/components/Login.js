import React, { Component, Fragment } from "react";
import Alert from "./Alert";
import Input from "./form-components/Input";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: null,
      errors: [],
      alert: {
        type: "d-none",
        message: "",
      },
    };

    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (evt) => {
    let name = evt.target.name;
    let value = evt.target.value;

    this.setState((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  };

  handleSubmit = (evt) => {
    evt.preventDefault();

    let errors = [];
    if (this.state.email === "") {
      errors.push("email");
    }
    if (this.state.password === "") {
      errors.push("password");
    }

    this.setState({ errors: errors });
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
          this.setState({
            alert: {
              type: "alert-danger",
              message: data.error.message,
            },
          });
        } else {
          this.handleJWTChange(data.token);
          window.localStorage.setItem("jwt", JSON.stringify(data.token));
          this.props.history.push({ pathname: "/admin" });
        }
      });
  };

  handleJWTChange(jwt) {
    this.props.handleJWTChange(jwt);
  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  render() {
    return (
      <Fragment>
        <h2>Login</h2>
        <hr />
        <Alert
          alertType={this.state.alert.type}
          alertMessage={this.state.alert.message}
        />
        <form className="pt-3" onSubmit={this.handleSubmit}>
          <Input
            title={"Email"}
            type={"email"}
            name={"email"}
            handleChange={this.handleChange}
            className={this.hasError("email") ? "is-invalid" : ""}
            errDiv={this.hasError("email") ? "text-danger" : "d-none"}
            errMsg={"Please enter a valid email address"}
          />

          <Input
            title={"Password"}
            type={"password"}
            name={"password"}
            handleChange={this.handleChange}
            className={this.hasError("password") ? "is-invalid" : ""}
            errDiv={this.hasError("password") ? "text-danger" : "d-none"}
            errMsg={"Please enter password"}
          />
          <hr />
          <button className="btn btn-primary">Login</button>
        </form>
      </Fragment>
    );
  }
}
