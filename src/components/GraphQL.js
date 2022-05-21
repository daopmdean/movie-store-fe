import React, { Component, Fragment } from "react";

export default class GraphQL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      isLoaded: false,
      error: null,
      alert: {
        type: "d-none",
        message: "",
      },
    };
  }

  componentDidMount() {
    const query = `
    {
      list {
        id
        title
        runtime
        year
        description
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
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          this.setState({
            alert: {
              type: "alert-danger",
              message: data.error.message,
            },
          });
        } else {
          this.setState({
            movies: data.data.list,
          });
        }
      });
  }

  render() {
    let { movies } = this.state;
    return (
      <Fragment>
        <h2>GraphQL</h2>
        <hr />
        <div className="list-group">
          {movies.map((movie) => (
            <a
              href="#!"
              key={movie.id}
              className="list-group-item list-group-item-action"
            >
              <strong>{movie.title}</strong>
              <br />
              <small className="text-muted">
                ({movie.year}) - {movie.runtime} minutes
              </small>
              <br />
              {movie.description}
            </a>
          ))}
        </div>
      </Fragment>
    );
  }
}
