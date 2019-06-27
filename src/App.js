import React, { useState } from "react";
import "./themes/original.scss";
import { Query } from "react-apollo";
import Search from "./components/Search/Search";
import IssuesContainer from "./containers/IssuesContainer";

// GraphQL queries
import { last20Issues } from "./api/issuePagination";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [activeSearch, setActiveSearch] = useState(true);
  return (
    <div className="App">
      <Search
        dataCallback={setSearchResults}
        activeSearch={activeSearch}
        setActiveSearch={setActiveSearch}
      />
      <Query
        notifyOnNetworkStatusChange={true}
        query={last20Issues}
        variables={{ owner: "facebook", name: "react" }}
      >
        {({ data, loading, error, fetchMore }) => {
          if (error) return <p>{error.message}</p>;
          const search = data.search;
          return (
            <IssuesContainer
              searchRes={search}
              issues={searchResults}
              reset={() => {
                setSearchResults([]);
                setActiveSearch(true);
              }}
            />
          );
        }}
      </Query>
    </div>
  );
};

export default App;
