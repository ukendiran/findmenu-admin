import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { Form, Input, Button, Card, Typography, notification, App } from "antd";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await apiService.post("login", values);
      const result = response.data;

      console.log(result)
      let isSubscribed = false;
      if (result.success) {
        if (result.data.subscription !== null) {
          isSubscribed = true
        }
        const data = {
          user: result.data.user,
          config: result.data.config,
          business: result.data.business,
          isSubscribed: isSubscribed,
          token: result.data.token,
        };
        dispatch(login(data));      
        // Show notification first, then navigate
        notificationApi.success({
          message: "Logged in Successfully",
          description: result.message || "Login Success",
          placement: "topRight",
          duration: 2, // Show for 2 seconds
        });

        // Wait a bit before navigating to allow notification to show
        setTimeout(() => {
          setLoading(false);
          navigate("/dashboard");
        }, 1000);

      } else {
        notificationApi.warning({
          message: "Login Failed",
          description: result.message || "Invalid credentials.",
          placement: "topRight",
        });
      }
    } catch (error) {
      const status = error.response?.status;
      const backendMsg = error.response?.data?.message;

      let description = "There was a problem connecting to the server.";
      if (status === 401) {
        description = backendMsg || "Unauthorized: Invalid credentials.";
      } else if (status === 422) {
        description = backendMsg || "Validation failed. Check your input.";
      } else if (status >= 500) {
        description = "Server error. Please try again later.";
      }

      notificationApi.error({
        message: "Login Error",
        description,
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <App>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10%",
        }}
      >
        <Card
          style={{
            width: 400,
            padding: 20,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: 10,
          }}
        >
          <Title level={2} style={{ textAlign: "center" }}>
            Login
          </Title>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </App>
  );
};

export default Login;
