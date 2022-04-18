// import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import React, { Component } from "react";
import { withRouter } from "react-router";
import "./searchBar.css";

class Search extends Component {
  state = {
    query: "",
    results: [],
  };

  async getInfo() {
    await axios
      .get(
        `https://sks-server-hbl9d.ondigitalocean.app/search?q=${encodeURI(
          this.state.query
        )}`
      )
      .then(({ data }) => {
        this.setState({
          results: data,
        });
      });
  }

  handleInputChange = (e) => {
    e.preventDefault();
    this.setState({
      query: this.search.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { history } = this.props;
    console.log(history);

    if (this.state.query && this.state.query.length > 1) {
      this.getInfo();
      history.push(
        `/results?q=${encodeURI(this.state.query)}&filter=activity,entity`
      );
      window.location.reload(false);
    }
  };

  render() {
    return (
      <div className="container pb-3 pt-1 mt-1">
        <form className="" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-2 ">
              <h2 className="text-end">Search:</h2>
            </div>
            <div className="col-8 ">
              <div className="form-text">
                <input
                  className="form-control ps-4 pe-4 rounded-pill"
                  type="text"
                  name="search"
                  placeholder="Enter search terms here"
                  onChange={(e) => this.setState({ query: e.target.value })}
                ></input>
              </div>
            </div>
            <div className="col-2">
              <button
                className="btn btn-primary ps-4 pe-4 rounded-pill mx-auto"
                type="submit"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Search);
