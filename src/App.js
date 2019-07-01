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
  const [searchParams, setSearchParams] = useState({ owner: "", name: "" });

  return (
    <div className="App">
      <Search
        dataCallback={setSearchResults}
        activeSearch={activeSearch}
        setActiveSearch={setActiveSearch}
        setSearchParams={(owner, name) => {
          setSearchParams({ owner, name });
        }}
      />
      {searchParams && searchParams.owner && searchParams.name ? (
        <Query
          notifyOnNetworkStatusChange={true}
          query={last20Issues}
          variables={{ owner: searchParams.owner, name: searchParams.name }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (error) return <p>{error.message}</p>;
            const search = data.search;
            return (
              <IssuesContainer
                data={data && !loading ? data.repository.issues : null}
                loading={loading}
                fetchMore={fetchMore}
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
      ) : null}
    </div>
  );
};

export default App;
