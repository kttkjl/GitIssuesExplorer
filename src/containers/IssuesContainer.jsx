import React, { useState } from "react";
import PropTypes from "prop-types";
import IssueCard from "../components/IssueCard/IssueCard";

const propTypes = {
  issues: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired
};

const issueTypes = {
  ALL: "all",
  OPEN: "open",
  CLOSED: "closed",
  PR: "pull_request"
};

const IssuesContainer = props => {
  const [issueType, setIssueType] = useState(issueTypes.ALL);

  const handleTypeChange = evt => {
    // console.log(evt.target.value);
    setIssueType(evt.target.value);
  };

  return props.issues.length > 0 ? (
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
        {props.data.nodes.map((issue, idx) => {
          if (issueType === issueTypes.ALL) {
            return <IssueCard key={idx} issue={issue} />;
          }
          // Check Open or closed
          if (issueType === issue.state) {
            return <IssueCard key={idx} issue={issue} />;
          }
          // PR?
          if (issueType === issueTypes.PR) {
            return issue.pull_request ? (
              <IssueCard key={idx} issue={issue} />
            ) : null;
          }
          return null;
        })}
      </section>
    </section>
  ) : null;
};

IssuesContainer.propTypes = propTypes;

export default IssuesContainer;
