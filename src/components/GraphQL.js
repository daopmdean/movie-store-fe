import React, { Component, Fragment } from "react";
import Input from "./form-components/Input";

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
      searchTerm: "",
    };
  }

  handleChange = (evt) => {
    let value = evt.target.value;
    this.setState(
      {
        searchTerm: value,
      },
      () => {
        const query = `
      {
        search(titleContains: "${this.state.searchTerm}") {
          id
          title
          runtime
          year
          description
        }
      }
      `;
        this.handleQuery(query, "search");
      }
    );
  };

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

    this.handleQuery(query, "list");
  }

  handleQuery(query, type) {
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
          if (type === "list") {
            this.setState({
              movies: data.data.list,
            });
          } else if (type === "search") {
            this.setState({
              movies: data.data.search,
            });
          }
        }
      });
  }

  render() {
    let { movies } = this.state;
    return (
      <Fragment>
        <h2>GraphQL</h2>
        <hr />

        <Input
          title={"Search"}
          type={"text"}
          name={"search"}
          value={this.state.searchTerm}
          handleChange={this.handleChange}
        />

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
