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
              color
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

export const last20each = gql`
  query last20each(
    $owner: String!
    $name: String!
    $issue_cursor: String
    $pr_cursor: String
  ) {
    repository(owner: $owner, name: $name) {
      issues(
        first: 20
        after: $issue_cursor
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
              color
            }
          }
        }
        pageInfo {
          endCursor
        }
      }
      pullRequests(
        first: 20
        after: $pr_cursor
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
              color
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

export const getMoreIssues = gql`
  query getMoreIssues($owner: String!, $name: String!, $cursor: String!) {
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
              color
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

export const getMorePRs = gql`
  query getMorePRs($owner: String!, $name: String!, $cursor: String!) {
    repository(owner: $owner, name: $name) {
      pullRequests(
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
              color
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
