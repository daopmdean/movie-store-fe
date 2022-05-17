import React, { Component, Fragment } from "react";
import "./EditMovie.css";
import Input from "./form-components/Input";
import Select from "./form-components/Select";
import Textarea from "./form-components/Textarea";

class EditMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: {
        id: 0,
        title: "",
        releaseDate: "",
        runtime: "",
        mpaaRating: "",
        rating: "",
        description: "",
      },
      mpaaOptions: [
        { value: "G", name: "G" },
        { value: "PG", name: "PG" },
        { value: "PG14", name: "PG14" },
        { value: "R", name: "R" },
        { value: "NC17", name: "NC17" },
      ],
      isLoaded: false,
      error: null,
      errors: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (evt) => {
    evt.preventDefault();

    let errors = [];
    if (this.state.movie.title === "") {
      errors.push("title");
    }
    if (this.state.movie.runtime === "") {
      errors.push("runtime");
    }
    if (this.state.movie.description === "") {
      errors.push("description");
    }

    this.setState({ errors: errors });
    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(evt.target);
    const payload = Object.fromEntries(data.entries());

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload),
    };

    fetch("http://localhost:4000/v1/admin/editmovie", requestOptions)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  };

  handleChange = (evt) => {
    let value = evt.target.value;
    let name = evt.target.name;
    this.setState((prevState) => ({
      movie: {
        ...prevState.movie,
        [name]: value,
      },
    }));
  };

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id > 0) {
      fetch("http://localhost:4000/v1/movies/" + id)
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
          const releaseDate = new Date(json.movie.releaseDate);
          this.setState(
            {
              movie: {
                id: json.movie.id,
                title: json.movie.title,
                releaseDate: releaseDate.toISOString().split("T")[0],
                runtime: json.movie.runtime,
                mpaaRating: json.movie.mpaaRating,
                rating: json.movie.rating,
                description: json.movie.description,
              },
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
    } else {
      this.setState({
        isLoaded: true,
      });
    }
  }

  render() {
    let { movie } = this.state;

    return (
      <Fragment>
        <h2>Add/Edit Movie</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="hidden"
            id="id"
            name="id"
            value={movie.id}
            onChange={this.handleChange}
          />

          <Input
            title={"Title"}
            type={"text"}
            name={"title"}
            value={movie.title}
            handleChange={this.handleChange}
            className={this.hasError("title") ? "is-invalid" : ""}
            errDiv={this.hasError("title") ? "text-danger" : "d-none"}
            errMsg={"Please enter title"}
          />

          <Input
            title={"Release Date"}
            type={"date"}
            name={"releaseDate"}
            value={movie.releaseDate}
            handleChange={this.handleChange}
          />

          <Input
            title={"Runtime"}
            type={"text"}
            name={"runtime"}
            value={movie.runtime}
            handleChange={this.handleChange}
            className={this.hasError("runtime") ? "is-invalid" : ""}
            errDiv={this.hasError("runtime") ? "text-danger" : "d-none"}
            errMsg={"Please enter runtime"}
          />

          <Select
            title={"MPAA Rating"}
            name={"mpaaRating"}
            placeholder={"Choose..."}
            value={movie.mpaaRating}
            options={this.state.mpaaOptions}
            handleChange={this.handleChange}
          />

          <Input
            title={"Rating"}
            type={"text"}
            name={"rating"}
            value={movie.rating}
            handleChange={this.handleChange}
          />

          <Textarea
            title={"Description"}
            name={"description"}
            value={movie.description}
            rows={"3"}
            handleChange={this.handleChange}
            className={this.hasError("description") ? "is-invalid" : ""}
            errDiv={this.hasError("description") ? "text-danger" : "d-none"}
            errMsg={"Please enter description"}
          />

          <hr></hr>

          <button className="btn btn-primary">Save</button>
        </form>

        <div className="mt-3">
          <pre>{JSON.stringify(this.state, null, 3)}</pre>
        </div>
      </Fragment>
    );
  }
}

export default EditMovie;
