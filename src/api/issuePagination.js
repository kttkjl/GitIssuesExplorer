import gql from "graphql-tag";

export const getLastIssuesQuery = (numIssues, owner, repo) => {
  return gql`
    query {
      repository(owner: ${owner}, name: ${repo}) {
        issues(last: ${numIssues}) {
          nodes {
            bodyText
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;
};

export const last20Issues = gql`
  query get20Issues($owner: String!, $name: String!, $cursor: String) {
    repository(owner: $owner, name: $name) {
      issues(
        first: 20
        after: $cursor
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          number
          body: bodyText
          title
          state
          labels(first: 5) {
            nodes {
              name
            }
          }
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
`;
