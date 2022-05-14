import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

class Movies extends Component {
  state = {
    movies: [],
    isLoaded: false,
  };

  componentDidMount() {
    fetch("http://localhost:4000/v1/movies")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          movies: json.movies,
          isLoaded: true,
        });
      });
  }

  render() {
    const { movies, isLoaded } = this.state;

    if (!isLoaded) {
      return <p>Loading...</p>;
    }

    return (
      <Fragment>
        <h2>Choose Movies</h2>
        <ul>
          {movies.map((m) => (
            <li key={m.id}>
              <Link to={`/movies/${m.id}`}>{m.title}</Link>
            </li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

export default Movies;
