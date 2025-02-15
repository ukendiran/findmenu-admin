import { useState } from "react";
import PropTypes from "prop-types";
import { App, Button, Input, notification } from "antd";
import apiService from "../../services/siteApiService";

const { TextArea } = Input;

const FeadbackTextArea = ({ restaurantId }) => {
  const [notificationApi, contextHolder] = notification.useNotification();

  const [message, setMessage] = useState("");

  // Function to count words
  const countWords = (text) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word).length; // Filters out empty strings
  };

  // Handler for text changes
  const handleChange = (e) => {
    const inputText = e.target.value;
    if (countWords(inputText) <= 200) {
      setMessage(inputText);
    } else {
      notificationApi.warning({
        message: "Word Limit Exceeded",
        description: "You can only enter up to 200 words.",
      });
    }
  };

  // Handler for form submission
  const handleSubmit = () => {
    const trimmedValue = message.trim();

    // Check if input is empty or exceeds word limit
    if (!trimmedValue) {
      notificationApi.error({
        message: "Submission Failed",
        description: "Feedback cannot be empty.",
      });
      return;
    }

    const wordCount = countWords(trimmedValue);
    if (wordCount > 200) {
      notificationApi.error({
        message: "Submission Failed",
        description: `Your feedback has ${wordCount} words. Please limit it to 200 words.`,
      });
      return;
    }

    apiService
      .post(`feedback`, {
        message: message,
        restaurantId: restaurantId,
      })
      .then((response) => {
        console.log(response);

        // Success notification
        notificationApi.success({
          message: "Feedback Submitted",
          description: "Thank you for your valuable feedback!",
        });

        // Reset the text area
        setMessage("");
      });
  };

  return (
    <App>
      {contextHolder}
      <TextArea
        placeholder="Thank you for visiting us! We would love to hear your valuable feedback."
        value={message}
        onChange={handleChange}
        style={{ resize: "none" }}
        rows={4}
      />
      <Button
        style={{ width: "100%", marginTop: 10 }}
        type="dashed"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </App>
  );
};
FeadbackTextArea.propTypes = {
  restaurantId: PropTypes.any,
};

export default FeadbackTextArea;