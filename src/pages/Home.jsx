import { Card, Col, Row, Typography } from "antd";
import { UserOutlined, HeartOutlined, MailOutlined } from "@ant-design/icons";
const { Title, Paragraph } = Typography;

import Banner from "../components/Banner";
import React from "react";
import Benefits from "../components/Benefits";
import PricingTable from "../components/PricingTable";
export default function Home() {
  const features = [
    {
      icon: <UserOutlined />,
      title: "Ready-to-use menu templates",
      desc: "Easily build your QR menu with our pre-designed template, or let our professionals do it for you within 48 hours!",
    },
    {
      icon: <HeartOutlined />,
      title: "Menu customized to your brand",
      desc: "Create or get from us a branded QR menu that fits with your logo, color palette, and branding guidelines.",
    },
    {
      icon: <MailOutlined />,
      title: "Ultra fast-loading menu & images",
      desc: "Your QR menu and images will instantly load on mobile devices, and your customers won’t need to download an app.",
    },
  ];

  return (
    <div>
      {/* Banner Carousel */}
      <Banner />
      <Benefits />

      <PricingTable />
      {/* Features Section */}
      <div
        className="feature-section"
        style={{ padding: "64px 24px", maxWidth: 1200, margin: "0 auto" }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 48 }}>
          Our Features
        </Title>
        

        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card hoverable style={{ textAlign: "center" }}>
                {React.cloneElement(feature.icon, {
                  style: { fontSize: 32, color: "#1890ff", marginBottom: 16 },
                })}
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
