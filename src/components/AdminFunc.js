import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminFunc(props) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.jwt === "") {
      props.history.push({ pathname: "/login" });
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
      .then((res) => {
        console.log("Response code: " + res.status);

        if (res.status !== 200) {
          setError("Invalid response code: " + res.status);
        }
        return res.json();
      })
      .then((json) => {
        setMovies(json.movies);
      });
  }, [props.jwt, props.history]);

  if (error !== null) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Fragment>
      <h2>Choose Movies</h2>
      <div className="list-group">
        {movies.map((m) => (
          <Link
            key={m.id}
            to={`/admin/movie/${m.id}`}
            className="list-group-item list-group-item-action"
          >
            {m.title}
          </Link>
        ))}
      </div>
    </Fragment>
  );
}
