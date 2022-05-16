import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

class Categories extends Component {
  state = {
    genres: [],
    isLoaded: false,
    error: null,
  };

  componentDidMount() {
    fetch("http://localhost:4000/v1/genres")
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
            genres: json.genres,
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
    const { genres, isLoaded, error } = this.state;

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    if (!isLoaded) {
      return <p>Loading...</p>;
    }

    return (
      <Fragment>
        <h2>Categories {this.props.title}</h2>
        <ul>
          {genres.map((g) => (
            <li key={g.id}>
              <Link
                to={{
                  pathname: `/categories/${g.id}`,
                  genreName: g.genreName,
                }}
              >
                {g.genreName}
              </Link>
            </li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

export default Categories;
