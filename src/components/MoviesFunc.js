import { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";

export default function MoviesFunc(props) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
      .then((res) => {
        console.log("Response code: " + res.status);

        if (res.status !== 200) {
          setError("Invalid response code: " + res.status);
        } else {
          setError(null);
        }
        return res.json();
      })
      .then((json) => {
        setMovies(json.movies);
      });
  }, []);

  if (error !== null) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Fragment>
      <h2>Choose Movies</h2>
      <div className="list-group">
        {movies.map((m) => (
          <Link
            key={m.id}
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
