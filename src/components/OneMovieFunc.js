import React, { Fragment, useEffect, useState } from "react";

export default function OneMovieFunc(props) {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/movies/` + props.match.params.id)
      .then((res) => {
        console.log("Response code: " + res.status);

        if (res.status !== 200) {
          setError("Invalid response code: " + res.status);
        }
        return res.json();
      })
      .then((json) => {
        setMovie(json.movie);
      });
  }, [props.match.params.id]);

  if (error !== null) {
    return <p>Error: {error.message}</p>;
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
