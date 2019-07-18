import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import IssueCard from "../components/IssueCard/IssueCard";

const propTypes = {
  issues: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired
};

const defaultProps = {
  issues: [],
  reset: () => {}
};

const issueTypes = {
  ALL: "all",
  OPEN: "open",
  CLOSED: "closed",
  PR: "pull_request"
};

const IssuesContainer = props => {
  let { onLoadMoreIssues, onLoadMorePRs, loading } = props;
  const [issueType, setIssueType] = useState(issueTypes.ALL);
  const issueRef = useRef(issueTypes.ALL);

  const handleTypeChange = evt => {
    setIssueType(evt.target.value);
    issueRef.current = evt.target.value;
  };

  const handleOnScroll = useCallback(() => {
    let scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    let scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    let clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    if (scrolledToBottom) {
      if (!loading && issueRef.current === issueTypes.PR) {
        onLoadMorePRs();
      } else {
        onLoadMoreIssues();
      }
    }
  }, [onLoadMoreIssues, onLoadMorePRs, loading]);

  useEffect(() => {
    console.log("adding listener");
    window.addEventListener("scroll", handleOnScroll);
    return () => {
      console.log("clearing listener");
      window.removeEventListener("scroll", handleOnScroll);
    };
  }, [props.loading, handleOnScroll]);

  const v4IssueRender = (issue, idx) => {
    // Massage the issue object
    // let currentIssue = { ...issue, labels: issue.labels.nodes };
    let currentIssue = issue;
    if (issueType === issueTypes.ALL) {
      return <IssueCard key={idx} issue={currentIssue} />;
    }
    // Check Open or closed
    if (issueType === issue.state.toLowerCase()) {
      return <IssueCard key={idx} issue={currentIssue} />;
    }
    // if PR
    if (issueType === issueTypes.PR) {
      // console.log("is PR");
      return <IssueCard key={idx} issue={currentIssue} />;
    }
    return null;
  };

  // const v3IssueRender = (issue, idx) => {
  //   if (issueType === issueTypes.ALL) {
  //     return <IssueCard key={idx} issue={issue} />;
  //   }
  //   // Check Open or closed
  //   if (issueType === issue.state) {
  //     return <IssueCard key={idx} issue={issue} />;
  //   }
  //   // PR?
  //   if (issueType === issueTypes.PR) {
  //     return issue.pull_request ? <IssueCard key={idx} issue={issue} /> : null;
  //   }
  //   return null;
  // };

  return (
    <section className="issuescontainer">
      <section className="issuescontainer-closeButtonDiv">
        <span
          className="icon icon-lg icon-dark icon-closeButton"
          onClick={props.reset}
        />
      </section>
      <section className="issuescontainer-tag-container">
        <button
          value={issueTypes.ALL}
          className={issueType === issueTypes.ALL ? `activeButton` : ``}
          onClick={handleTypeChange}
        >
          All Issues
        </button>
        <button
          value={issueTypes.OPEN}
          className={issueType === issueTypes.OPEN ? `activeButton` : ``}
          onClick={handleTypeChange}
        >
          Open Issues
        </button>
        <button
          value={issueTypes.CLOSED}
          className={issueType === issueTypes.CLOSED ? `activeButton` : ``}
          onClick={handleTypeChange}
        >
          Closed Issues
        </button>
        <button
          value={issueTypes.PR}
          className={issueType === issueTypes.PR ? `activeButton` : ``}
          onClick={handleTypeChange}
        >
          Pull Requests
        </button>
      </section>
      <section className="issuescontainer-issues-container">
        {/* {props.issues.map((issue, idx) => { */}
        {issueType === issueTypes.PR
          ? props.pullRequests.map(v4IssueRender)
          : props.issues.map(v4IssueRender)}
      </section>
    </section>
  );
};

IssuesContainer.propTypes = propTypes;
IssuesContainer.defaultProps = defaultProps;

export default IssuesContainer;
