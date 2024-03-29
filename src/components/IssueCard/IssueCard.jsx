import React from "react";
import PropTypes from "prop-types";
const tinycolor = require("tinycolor2");

const propTypes = {
  issue: PropTypes.object.isRequired
};

const IssueCard = props => {
  return (
    <section className="issuecard-container">
      <section className="issuecard-header">
        <h2>
          [{props.issue.number}] {props.issue.title}
        </h2>
        <span className="issuecard-header status-icons">
          {props.issue.state.toLowerCase() === "closed" ? (
            <span className="icon icon-sm icon-issueClosed" />
          ) : null}
          {props.issue.pull_request ? (
            <span className="icon icon-sm icon-pullRequest" />
          ) : null}
        </span>
      </section>
      <section className="issuecard-body">
        <p>{props.issue.body}</p>
      </section>
      <section className="issuecard-tags">
        {props.issue.labels.nodes.map((label, idx) => {
          // console.log(tinycolor(label.color).isDark());
          return (
            <span
              key={`label-${idx}`}
              className="issuecard-tags-tag"
              style={{
                backgroundColor: `#${label.color}`,
                color: `${
                  tinycolor(label.color).isDark() ? "white" : "	#383838"
                }`
              }}
            >
              {label.name}
            </span>
          );
        })}
      </section>
    </section>
  );
};

IssueCard.propTypes = propTypes;
// IssueCard.defaultProps = defaultProps;

export default IssueCard;
