import { Typography, Button, Space, Result } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "20" }}>
      <Result
        status="warning"
        title={<Title level={2}>{`We're launching soon!`}</Title>}
        subTitle={
          <Text type="secondary">
            Our website is under construction. Stay tuned for more updates.
          </Text>
        }
        extra={
          <Space>
            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default ComingSoon;
