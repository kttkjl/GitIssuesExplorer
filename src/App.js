import React, { useState } from "react";
import "./themes/original.scss";
import { Query } from "react-apollo";
import Search from "./components/Search/Search";
import IssuesContainer from "./containers/IssuesContainer";

// GraphQL queries
import { last20Issues, last20each } from "./api/issuePagination";

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
          let updatedValues = { owner, name };
          setSearchParams(prev => {
            return { ...prev, ...updatedValues };
          });
        }}
      />
      {/* {searchParams.owner + searchParams.name} */}
      {searchParams && searchParams.owner && searchParams.name ? (
        <Query
          notifyOnNetworkStatusChange={true}
          query={last20each}
          variables={{ owner: searchParams.owner, name: searchParams.name }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (error) return <p>{error.message}</p>;
            return (
              <IssuesContainer
                issues={
                  !loading && data && data.repository.issues
                    ? data.repository.issues.nodes
                    : []
                }
                pullRequests={
                  !loading && data && data.repository.pullRequests
                    ? data.repository.pullRequests.nodes
                    : []
                }
                loading={loading}
                onLoadMore={() => {
                  fetchMore({
                    variables: {
                      name: "name",
                      owner: "owner",
                      cursor: "cursor"
                    },
                    updateQuery: (prevRes, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prevRes;
                      return Object.assign({}, prevRes, {
                        feed: [...prevRes.feed, ...fetchMoreResult.feed]
                      });
                    }
                  });
                }}
                // issues={searchResults} //this is for API v3
                reset={() => {
                  // setSearchResults([]);
                  setSearchParams({ owner: "", name: "" });
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
