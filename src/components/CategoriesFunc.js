import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";

export default function CategoriesFunc(props) {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
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
        setGenres(json.genres);
      });
  }, []);

  if (error !== null) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Fragment>
      <h2>Categories</h2>

      <div className="list-group">
        {genres.map((g) => (
          <Link
            key={g.id}
            to={{
              pathname: `/categories/${g.id}`,
              genreName: g.genreName,
            }}
            className="list-group-item list-group-item-action"
          >
            {g.genreName}
          </Link>
        ))}
      </div>
    </Fragment>
  );
}
