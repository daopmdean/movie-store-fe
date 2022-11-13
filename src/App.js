import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AdminFunc from "./components/AdminFunc";
import CategoriesFunc from "./components/CategoriesFunc";
import EditMovieFunc from "./components/EditMovieFunc";
import GraphQL from "./components/GraphQL";
import Home from "./components/Home";
import LoginFunc from "./components/LoginFunc";
import MoviesFunc from "./components/MoviesFunc";
import OneGenreFunc from "./components/OneGenreFunc";
import OneMovieFunc from "./components/OneMovieFunc";
import OneMovieGraphQL from "./components/OneMovieGraphQL";

export default function App(props) {
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    let localToken = window.localStorage.getItem("jwt");
    if (localToken) {
      if (jwt === "") {
        setJwt(JSON.parse(localToken));
      }
    }
  }, [jwt]);

  function handleJWTChange(jwt) {
    setJwt(jwt);
  }

  function logout() {
    console.log(jwt, "------------");
    setJwt("");
    window.localStorage.removeItem("jwt");
  }

  let authLink;
  if (jwt === "") {
    authLink = <Link to="/login">Logina</Link>;
  } else {
    authLink = (
      <Link to="/logout" onClick={logout}>
        Logoutas
      </Link>
    );
  }
  console.log(jwt, "------------");
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

                {jwt !== "" && (
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
              <Route path="/movies/:id" component={OneMovieFunc} />
              <Route
                path="/movies-graphql/:id"
                component={(props) => <OneMovieGraphQL {...props} />}
              />
              <Route path="/movies">
                <MoviesFunc />
              </Route>

              <Route
                exact
                path="/login"
                component={(props) => (
                  <LoginFunc {...props} handleJWTChange={handleJWTChange} />
                )}
              />

              <Route exact path="/categories" component={CategoriesFunc} />
              <Route exact path="/categories/:id" component={OneGenreFunc} />

              <Route
                path="/admin/movie/:id"
                component={(props) => <EditMovieFunc {...props} jwt={jwt} />}
              />
              <Route
                path="/admin"
                component={(props) => <AdminFunc {...props} jwt={jwt} />}
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
