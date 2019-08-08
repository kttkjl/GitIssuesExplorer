import React, { useState } from "react";
import "./themes/original.scss";
import { Query } from "react-apollo";
import Search from "./components/Search/Search";
import IssuesContainer from "./containers/IssuesContainer";

// GraphQL queries
import { last20each, getMorePRs, getMoreIssues } from "./api/issuePagination";

const App = () => {
  // const [searchResults, setSearchResults] = useState([]);
  const [activeSearch, setActiveSearch] = useState(true);
  const [searchParams, setSearchParams] = useState({ owner: "", name: "" });

  return (
    <div className="App">
      <Search
        // dataCallback={setSearchResults}
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
            const issues = data.repository ? data.repository.issues.nodes : [];
            const pullRequests = data.repository
              ? data.repository.pullRequests.nodes
              : [];
            return (
              <IssuesContainer
                issues={issues}
                pullRequests={pullRequests}
                loading={loading}
                onLoadMoreIssues={() => {
                  fetchMore({
                    variables: {
                      name: searchParams.name,
                      owner: searchParams.owner,
                      query: getMoreIssues,
                      cursor: data.repository.issues.pageInfo.endCursor
                    },

                    updateQuery: (prevRes, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prevRes;
                      return {
                        repository: {
                          ...prevRes.repository,
                          issues: {
                            ...prevRes.issues,
                            nodes: [
                              ...prevRes.repository.issues.nodes,
                              ...fetchMoreResult.repository.issues.nodes
                            ],
                            pageInfo:
                              fetchMoreResult.repository.issues.pageInfo,
                            __typename: prevRes.repository.issues.__typename
                          }
                        }
                      };
                    }
                  });
                }}
                onLoadMorePRs={() => {
                  fetchMore({
                    variables: {
                      name: searchParams.name,
                      owner: searchParams.owner,
                      query: getMorePRs,
                      cursor: data.repository.pullRequests.pageInfo.endCursor
                    },
                    updateQuery: (prevRes, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prevRes;
                      return {
                        repository: {
                          ...prevRes.repository,
                          pullRequests: {
                            ...prevRes.pullRequests,
                            nodes: [
                              ...prevRes.repository.pullRequests.nodes,
                              ...fetchMoreResult.repository.pullRequests.nodes
                            ],
                            pageInfo:
                              fetchMoreResult.repository.pullRequests.pageInfo,
                            __typename:
                              prevRes.repository.pullRequests.__typename
                          }
                        }
                      };
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
