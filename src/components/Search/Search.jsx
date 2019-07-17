import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import isUrl from "is-url";
import axios from "axios";

const propTypes = {
  dataCallback: PropTypes.func,
  activeSearch: PropTypes.bool.isRequired
  // setActiveSearch: PropTypes.func.isRequired
};
const defaultProps = {};

const Search = props => {
  const [page, setPage] = useState("");
  const [searchError, setSearchError] = useState(null);
  const inputElement = useRef(null);

  const handleKeyDown = async evt => {
    if (evt.key === "Enter") {
      handleSubmit();
    }
  };

  const massageIssuesUrl = url => {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace("www.", "");
    const userRepo = urlObj.pathname.split("/");
    userRepo.shift();
    if (hostname !== "github.com") {
      throw new Error("Not a Github address");
    }
    if (userRepo.length < 2) {
      throw new Error("Invalid repository URL");
    }
    // For V3 API call
    // return `https://api.github.com/repos/${userRepo[0]}/${
    //   userRepo[1]
    // }/issues?state=all&per_page=50`;

    // For V4 API call
    return { owner: userRepo[0], name: userRepo[1] };
  };

  /**
   * Async call to github repo
   */
  const handleSubmit = async () => {
    setSearchError(null);
    try {
      if (!isUrl(inputElement.current.value)) {
        throw new Error("Invalid URL");
      }
      // Github v3 API call
      // const url = massageIssuesUrl(inputElement.current.value);
      // let res = await axios.get(url);
      // props.setActiveSearch(false);
      // props.dataCallback(res.data);

      // Github v4 API calls - GraphQL
      const queryParams = massageIssuesUrl(inputElement.current.value);
      props.setSearchParams(queryParams.owner, queryParams.name);
      props.setActiveSearch(false);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setSearchError("Github repo not found");
      } else {
        setSearchError(e.message);
      }
    }
  };

  return (
    <section
      className={`search-container search-container${
        props.activeSearch ? "-open" : "-collapsed"
      }`}
    >
      <h1>GitHub Issue Viewer</h1>
      <section
        className={`search-field search-field${
          props.activeSearch ? "-open" : "-collapsed"
        }`}
      >
        <button onClick={handleSubmit}>
          <span className="icon icon-search" />
        </button>
        <input
          ref={inputElement}
          type="text"
          placeholder="Paste a link to a Github repo!"
          onKeyDown={handleKeyDown}
        />
      </section>
      {props.activeSearch ? (
        <section className="search-errorField ">{searchError}</section>
      ) : null}
      {props.activeSearch ? null : (
        <a href={inputElement.current.value}>{inputElement.current.value}</a>
      )}
    </section>
  );
};

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default Search;
