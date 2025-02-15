import { Form, Input, Button, Row, Col, notification, Result, App } from "antd";
import {
  MailOutlined,
  UserOutlined,
  MessageOutlined,
  MobileOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import apiService from "../services/siteApiService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { imageUrl } from "../utils/common";

const ContactUs = () => {
  const navigate = useNavigate();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [formSubmit, setFormSubmit] = useState(false);
  const onFinish = (values) => {
    apiService.post("/contact", values).then(() => {
      setFormSubmit(true);
      notificationApi.success({
        message: "Message Sent",
        description:
          "Thank you for contacting us! We will get back to you soon.",
      });
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <App>
      {contextHolder}
      <div style={{ width: "100%", margin: "0", padding: "0" }}>
        <img
          src={imageUrl("images/banner/contact-us.png")}
          alt="Contact Us Banner"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <div style={{ padding: "50px 0", backgroundColor: "#f9f9f9" }}>
        <Row justify="center">
          <Col xs={24} sm={18} md={12} lg={10}>
            <div style={{ textAlign: "center", margin: "30px" }}>
              {!formSubmit && (
                <h2>
                  If you have any urgent questions or concerns, feel free to
                  call us directly or send an email. We’re happy to assist you!
                </h2>
              )}
            </div>

            {!formSubmit && (
              <Form
                name="contact"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                style={{ margin: 20 }}
              >
                {/* Name Field */}
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
                    placeholder="Mobile Number"
                    size="large"
                  />
                </Form.Item>

                {/* Message Field */}
                <Form.Item
                  name="message"
                  rules={[
                    { required: true, message: "Please enter your message!" },
                    {
                      min: 10,
                      message: "Message must be at least 10 characters!",
                    },
                  ]}
                >
                  <Input.TextArea
                    prefix={<MessageOutlined />}
                    placeholder="Your Message"
                    rows={4}
                    size="large"
                  />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                  <Button type="primary" htmlType="submit" block size="large">
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            )}

            {formSubmit && (
              <Result
                icon={<SmileOutlined />}
                title="Thank you for contacting us! We will get back to you soon."
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
    </App>
  );
};

export default ContactUs;
