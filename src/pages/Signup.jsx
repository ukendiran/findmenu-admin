import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  notification,
  Result,
  App,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  MobileOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import apiService from "../services/siteApiService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { imageUrl } from "../utils/common";

const { Title } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const { notification: notificationApi } = App.useApp();
  const [formSubmit, setFormSubmit] = useState(false);
  const onFinish = (values) => {
    delete values["confirmPassword"];
    apiService.post("/users", values).then(() => {
      setFormSubmit(true);
      notificationApi.success({
        message: "Signup Successful",
        description:
          "You have successfully signed up. We will get back to you soon.",
      });
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div style={{ padding: "50px 0", backgroundColor: "#f9f9f9" }}>
        <Row justify="center">
          <Col xs={24} sm={18} md={12} lg={8}>
            <img
              src={imageUrl("images/banner/register.png")}
              alt="Contact Us Banner"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                marginTop: 50,
              }}
            />
          </Col>
          <Col xs={24} sm={18} md={12} lg={8}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <Title level={2}>Create an Account</Title>
              <p>Sign up to enjoy all our amazing features!</p>
            </div>

            {!formSubmit && (
              <Form
                name="signup"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                style={{ margin: 20 }}
              >
                {/* Full Name Field */}
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your name!" },
                    {
                      max: 50,
                      message: "Name cannot be longer than 50 characters!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Full Name"
                    size="large"
                  />
                </Form.Item>

                {/* Email Field */}
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    {
                      type: "email",
                      message: "Please enter a valid email address!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Email Address"
                    size="large"
                  />
                </Form.Item>

                {/* Mobile Field */}
                <Form.Item
                  name="mobile"
                  rules={[
                    { required: true, message: "Please enter your mobile!" },
                    {
                      type: "mobile",
                      message: "Please enter a valid mobile number!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MobileOutlined />}
                    placeholder="Email Address"
                    size="large"
                  />
                </Form.Item>

                {/* Password Field */}
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                    {
                      min: 8,
                      message: "Password must be at least 8 characters!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
                    size="large"
                  />
                </Form.Item>

                {/* Confirm Password Field */}
                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Please confirm your password!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm Password"
                    size="large"
                  />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                  <Button type="primary" htmlType="submit" block size="large">
                    Sign Up
                  </Button>
                </Form.Item>
              </Form>
            )}

            {formSubmit && (
              <Result
                icon={<SmileOutlined />}
                title="You have successfully signed up. We will get back to you soon."
                extra={
                  <Button type="primary" onClick={() => navigate("/")}>
                    Close
                  </Button>
                }
              />
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Signup;
