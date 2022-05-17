import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Admin from "./components/Admin";
import Categories from "./components/Categories";
import EditMovie from "./components/EditMovie";
import Home from "./components/Home";
import Movies from "./components/Movies";
import OneGenre from "./components/OneGenre";
import OneMovie from "./components/OneMovie";

export default function App() {
  return (
    <Router>
      <div className="container">
        <div className="row">
          <h1 className="mt-3">Go Watch a Movie!</h1>
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
                <li className="list-group-item">
                  <Link to="/admin/movie/0">Add Movie</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/admin">Manage Catalogue</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="col-md-10">
            <Switch>
              <Route path="/movies/:id" component={OneMovie} />
              <Route path="/movies">
                <Movies />
              </Route>

              <Route exact path="/categories" component={Categories} />
              <Route exact path="/categories/:id" component={OneGenre} />

              <Route path="/admin/movie/:id" component={EditMovie} />
              <Route path="/admin">
                <Admin />
              </Route>
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}
