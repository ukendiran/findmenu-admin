import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

export default function NotFound() {
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const handleBack = () => {
    navigate(-1); // Equivalent to history.goBack()
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleBack}>
          Go Back
        </Button>
      }
    />
  );
}
