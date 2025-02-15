import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { Form, Input, Button, Card, Typography, notification, App } from "antd";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = localStorage.getItem("isAuthenticated");
  if (auth) {
    window.location.href = "/dashboard";
  }
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    apiService
      .post("auth/login", values)
      .then((response) => {
        const result = response.data;
        setLoading(false);
        if (result.success) {
          const data = {
            user: result.userData,
            config: result.configData,
            token: result.token,
          };
          dispatch(login(data));
          navigate("/dashboard");
        } else {
          notification.warning({
            message: "Error",
            description: "Invalid Credentials",
            placement: "topRight",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        notification.error({
          message: "Network Error",
          description: "There was a problem connecting to the server.",
          placement: "topRight",
        });
      });
  };

  return (
    <App>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10%",
        }}
      >
        <Card style={{ width: 400, padding: 20, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", borderRadius: 10 }}>
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
