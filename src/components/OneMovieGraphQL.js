import React, { Component, Fragment } from "react";

export default class OneMovieGraphQL extends Component {
  state = {
    movie: {},
    isLoaded: false,
    error: null,
  };

  componentDidMount() {
    const query = `
      {
        movie(id: ${this.props.match.params.id}) {
          id
          title
          runtime
          year
          description
          mpaaRating
          releaseDate
          rating
          poster
        }
      }
      `;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: query,
    };

    fetch("http://localhost:4000/graphql", requestOptions)
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
            movie: json.data.movie,
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
    const { movie, isLoaded, error } = this.state;

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    if (!isLoaded) {
      return <p>Loading...</p>;
    }

    if (movie.genres) {
      movie.genres = Object.values(movie.genres);
    } else {
      movie.genres = [];
    }

    return (
      <Fragment>
        <h2>
          Movie: {movie.title} ({movie.year})
        </h2>

        {movie.poster !== "" && (
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster}`}
              alt="poster"
            />
          </div>
        )}

        <div className="float-start">
          <small>Rating: {movie.mpaaRating}</small>
        </div>
        <div className="float-end">
          {movie.genres.map((m, index) => (
            <span className="badge bg-secondary me-1" key={index}>
              {m}
            </span>
          ))}
        </div>
        <div className="clearfix"></div>
        <hr />

        <table className="table table-compact table-striped">
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <strong>Title:</strong>
              </td>
              <td>{movie.title}</td>
            </tr>
            <tr>
              <td>
                <strong>Description:</strong>
              </td>
              <td>{movie.description}</td>
            </tr>
            <tr>
              <td>
                <strong>Run time:</strong>
              </td>
              <td>{movie.runtime} minutes</td>
            </tr>
          </tbody>
        </table>
      </Fragment>
    );
  }
}
