import React, { useState, useEffect, Fragment } from "react";
import { confirmAlert } from "react-confirm-alert";
import { Link } from "react-router-dom";
import Alert from "./Alert";
import Input from "./form-components/Input";
import Select from "./form-components/Select";
import Textarea from "./form-components/Textarea";
import "./EditMovie.css";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function EditMovieFunc(props) {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [alert, setAlert] = useState({ type: "d-none", message: "" });
  const mpaaOptions = [
    { value: "G", name: "G" },
    { value: "PG", name: "PG" },
    { value: "PG14", name: "PG14" },
    { value: "R", name: "R" },
    { value: "NC17", name: "NC17" },
  ];

  useEffect(() => {
    if (props.jwt === "") {
      props.history.push({ pathname: "/login" });
      return;
    }

    const id = props.match.params.id;
    if (id > 0) {
      fetch(`${process.env.REACT_APP_API_URL}/v1/movies/` + id)
        .then((res) => {
          console.log("Response code: " + res.status);

          if (res.status !== 200) {
            setError("Invalid response code: " + res.status);
          }
          return res.json();
        })
        .then((json) => {
          const releaseDate = new Date(json.movie.releaseDate);
          setMovie({
            id: json.movie.id,
            title: json.movie.title,
            releaseDate: releaseDate.toISOString().split("T")[0],
            runtime: json.movie.runtime,
            mpaaRating: json.movie.mpaaRating,
            rating: json.movie.rating,
            description: json.movie.description,
          });
        });
    }
  }, [props.jwt, props.history, props.match.params.id]);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    let errors = [];
    if (movie.title === "") {
      errors.push("title");
    }
    if (movie.runtime === "") {
      errors.push("runtime");
    }
    if (movie.description === "") {
      errors.push("description");
    }

    setErrors(errors);
    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(evt.target);
    const payload = Object.fromEntries(data.entries());
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + props.jwt);

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    };

    fetch(`${process.env.REACT_APP_API_URL}/v1/admin/editmovie`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setAlert({
            type: "alert-danger",
            message: data.error.message,
          });
        } else {
          props.history.push({ pathname: "/admin" });
        }
      });
  };

  const handleChange = () => (evt) => {
    let value = evt.target.value;
    let name = evt.target.name;
    setMovie({
      ...movie,
      [name]: value,
    });
  };

  const confirmDelete = (evt) => {
    confirmAlert({
      title: "Delete Movie?",
      message: "Are you sure to delete " + movie.title,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + props.jwt);

            fetch(
              `${process.env.REACT_APP_API_URL}/v1/admin/deletemovie/` +
                movie.id,
              { method: "GET", headers: headers }
            )
              .then((res) => res.json())
              .then((json) => {
                if (json.error) {
                  setAlert({
                    type: "alert-danger",
                    message: json.error.message,
                  });
                } else {
                  setAlert({
                    type: "alert-success",
                    message: "Movie deleted",
                  });
                  props.history.push({ pathname: "/admin" });
                }
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  function hasError(key) {
    return errors.indexOf(key) !== -1;
  }

  if (error !== null) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Fragment>
      <h2>Add/Edit Movie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          id="id"
          name="id"
          value={movie.id}
          onChange={movie.id}
        />

        <Input
          title={"Title"}
          type={"text"}
          name={"title"}
          value={movie.title}
          handleChange={handleChange("title")}
          className={hasError("title") ? "is-invalid" : ""}
          errDiv={hasError("title") ? "text-danger" : "d-none"}
          errMsg={"Please enter title"}
        />

        <Input
          title={"Release Date"}
          type={"date"}
          name={"releaseDate"}
          value={movie.releaseDate}
          handleChange={handleChange("releaseDate")}
        />

        <Input
          title={"Runtime"}
          type={"text"}
          name={"runtime"}
          value={movie.runtime}
          handleChange={handleChange("runtime")}
          className={hasError("runtime") ? "is-invalid" : ""}
          errDiv={hasError("runtime") ? "text-danger" : "d-none"}
          errMsg={"Please enter runtime"}
        />

        <Select
          title={"MPAA Rating"}
          name={"mpaaRating"}
          placeholder={"Choose..."}
          value={movie.mpaaRating}
          options={mpaaOptions}
          handleChange={handleChange("mpaaRating")}
        />

        <Input
          title={"Rating"}
          type={"text"}
          name={"rating"}
          value={movie.rating}
          handleChange={handleChange("rating")}
        />

        <Textarea
          title={"Description"}
          name={"description"}
          value={movie.description}
          rows={"3"}
          handleChange={handleChange("description")}
          className={hasError("description") ? "is-invalid" : ""}
          errDiv={hasError("description") ? "text-danger" : "d-none"}
          errMsg={"Please enter description"}
        />

        <hr></hr>

        <button className="btn btn-primary">Save</button>
        <Link to={`/admin`} className="btn btn-warning ms-1">
          Cancel
        </Link>
        {movie.id > 0 && (
          <a href="#!" className="btn btn-danger ms-1" onClick={confirmDelete}>
            Delete
          </a>
        )}
      </form>
      <Alert alertType={alert.type} alertMessage={alert.message} />
    </Fragment>
  );
}
