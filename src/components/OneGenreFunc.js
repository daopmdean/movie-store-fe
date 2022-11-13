import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function OneGenreFunc(props) {
  let [movies, setMovies] = useState([]);
  let [genreName, setGenreName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/v1/movies-genre/` +
        props.match.params.id
    )
      .then((res) => {
        console.log("Response code: " + res.status);

        if (res.status !== 200) {
          setError("Invalid response code: ", res.status);
        }
        return res.json();
      })
      .then((json) => {
        setMovies(json.movies);
        setGenreName(props.location.genreName);
      });
  }, [props.match.params.id, props.location.genreName]);

  if (!movies) {
    movies = [];
  }

  if (error !== null) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Fragment>
      <h2>Genre: {genreName}</h2>

      <div className="list-group">
        {movies.map((m, i) => (
          <Link
            key={i}
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
