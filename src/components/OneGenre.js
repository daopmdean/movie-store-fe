import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

export default class OneGenre extends Component {
  state = {
    movies: [],
    isLoaded: false,
    error: null,
  };

  componentDidMount() {
    fetch("http://localhost:4000/v1/movies-genre/" + this.props.match.params.id)
      .then((res) => {
        console.log("Response code: " + res.status);

        if (res.status !== 200) {
          let err = Error;
          err.message = "Invalid response code: " + res.status;
          this.setState({
            error: err,
          });
        }
        return res.json();
      })
      .then((json) => {
        this.setState(
          {
            movies: json.movies,
            isLoaded: true,
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
      });
  }

  render() {
    let { movies, isLoaded, error } = this.state;

    if (!movies) {
      movies = [];
    }

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    if (!isLoaded) {
      return <p>Loading...</p>;
    }

    return (
      <Fragment>
        <h2>Genre:</h2>

        <div className="list-group">
          {movies.map((m) => (
            <Link
              to={`/movies/${m.id}`}
              className="list-group-item list-group-item-action"
            >
              {m.title}
            </Link>
          ))}
        </div>
      </Fragment>
    );
  }
}
