import { useState } from "react";
import PropTypes from "prop-types";
import { Typography } from "antd";
const { Paragraph } = Typography;

const ExpandableParagraph = ({ text, maxLength }) => {
  const [expanded, setExpanded] = useState(false);

  // Truncate text if it's longer than maxLength
  const displayText = expanded
    ? text
    : text.length > maxLength
    ? text.slice(0, maxLength) + "..."
    : text;

  const shouldTruncate = text.length > maxLength;

  return (
    <Paragraph>
      {displayText}
      {shouldTruncate && (
        <a onClick={() => setExpanded(!expanded)}>
          {expanded ? " show less" : " read more"}
        </a>
      )}
    </Paragraph>
  );
};

// Example usage component
const ParagraphList = ({ text, maxLength }) => {
  return (
    <div>
      <ExpandableParagraph text={text} maxLength={maxLength} />
    </div>
  );
};

ExpandableParagraph.propTypes = {
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
};

ParagraphList.propTypes = {
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
};

export default ParagraphList;