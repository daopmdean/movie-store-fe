import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Admin from "./components/Admin";
import Categories from "./components/Categories";
import EditMovie from "./components/EditMovie";
import GraphQL from "./components/GraphQL";
import Home from "./components/Home";
import Login from "./components/Login";
import Movies from "./components/Movies";
import OneGenre from "./components/OneGenre";
import OneMovie from "./components/OneMovie";
import OneMovieGraphQL from "./components/OneMovieGraphQL";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: "",
    };

    this.handleJWTChange = this.handleJWTChange.bind(this);
  }

  componentDidMount() {
    let localToken = window.localStorage.getItem("jwt");
    if (this.state.jwt === "") {
      this.setState({
        jwt: JSON.parse(localToken),
      });
    }
  }

  handleJWTChange = (jwt) => {
    this.setState({
      jwt: jwt,
    });
  };

  logout = () => {
    window.localStorage.removeItem("jwt");
    this.setState({
      jwt: "",
    });
  };

  render() {
    let authLink;
    if (this.state.jwt === "") {
      authLink = (
        <Link to="/login" onClick={this.logouta}>
          Login
        </Link>
      );
    } else {
      authLink = (
        <Link to="/logout" onClick={this.logout}>
          Logout
        </Link>
      );
    }

    return (
      <Router>
        <div className="container">
          <div className="row">
            <div className="col mt-3">
              <h1 className="mt-3">Go Watch a Movie!</h1>
            </div>
            <div className="col mt-3 text-end">{authLink}</div>
            <hr className="mb-3"></hr>
          </div>

          <div className="row">
            <div className="col-md-2">
              <nav>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/movies">Movies</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/categories">Categories</Link>
                  </li>

                  {this.state.jwt !== "" && (
                    <Fragment>
                      <li className="list-group-item">
                        <Link to="/admin/movie/0">Add Movie</Link>
                      </li>
                      <li className="list-group-item">
                        <Link to="/admin">Manage Catalogue</Link>
                      </li>
                    </Fragment>
                  )}

                  <li className="list-group-item">
                    <Link to="/graphql">GraphQL</Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="col-md-10">
              <Switch>
                <Route path="/movies/:id" component={OneMovie} />
                <Route
                  path="/movies-graphql/:id"
                  component={(props) => <OneMovieGraphQL {...props} />}
                />
                <Route path="/movies">
                  <Movies />
                </Route>

                <Route
                  exact
                  path="/login"
                  component={(props) => (
                    <Login {...props} handleJWTChange={this.handleJWTChange} />
                  )}
                />

                <Route exact path="/categories" component={Categories} />
                <Route exact path="/categories/:id" component={OneGenre} />

                <Route
                  path="/admin/movie/:id"
                  component={(props) => (
                    <EditMovie {...props} jwt={this.state.jwt} />
                  )}
                />
                <Route
                  path="/admin"
                  component={(props) => (
                    <Admin {...props} jwt={this.state.jwt} />
                  )}
                />

                <Route exact path="/graphql" component={GraphQL} />

                <Route path="/" component={Home} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
