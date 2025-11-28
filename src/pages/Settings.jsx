import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Space,
  Divider,
  Collapse,
} from "antd";
import {
  ShopOutlined,
  BellOutlined,
  QrcodeOutlined,
  MenuOutlined,
  LockOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import BusinessDetails from "../Settings/BusinessDetails";
import Notifications from "../Settings/Notifications";
import QRCodePage from "../Settings/QRCodePage";
import MenuManagement from "../Settings/MenuManagement";
import PasswordManagement from "../Settings/PasswordManagement";
import apiService from "../services/apiService";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
  const business = useSelector((state) => state.auth.business);
  const businessUrl = `${apiService.appUrl}/${business.code}`;
  const groupUrl = `${apiService.appUrl}/group/${business.group?.code || undefined}`;
  
  const [activeSection, setActiveSection] = useState("business-details");

  if (!user) {
    return <p>Loading user data...</p>;
  }

  const settingsSections = [
    {
      id: "business-details",
      title: "Business Details",
      icon: <ShopOutlined />,
      description: "Manage your business information, logo, and banner",
      color: "#1890ff",
      component: <BusinessDetails businessId={user.businessId} />,
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <BellOutlined />,
      description: "Configure review settings and social media notifications",
      color: "#52c41a",
      component: <Notifications userData={user.businessId} />,
    },
    {
      id: "qr-code",
      title: "QR Code",
      icon: <QrcodeOutlined />,
      description: "Download and share your business QR code",
      color: "#722ed1",
      component: <QRCodePage url={businessUrl} businessCode={business.code} />,
    },
    ...(business?.group_id
      ? [
          {
            id: "group-qr-code",
            title: "Group QR Code",
            icon: <QrcodeOutlined />,
            description: "Download and share your group QR code",
            color: "#eb2f96",
            component: <QRCodePage url={groupUrl} businessCode={business?.code} />,
          },
        ]
      : []),
    {
      id: "menu-management",
      title: "Menu Management",
      icon: <MenuOutlined />,
      description: "Organize and manage your menu categories",
      color: "#fa8c16",
      component: <MenuManagement businessId={user.businessId} />,
    },
    {
      id: "password-management",
      title: "Password Management",
      icon: <LockOutlined />,
      description: "Change your account password",
      color: "#f5222d",
      component: <PasswordManagement business={business} />,
    },
  ];

  const renderNavigation = () => {
    return (
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3} style={{ marginBottom: 20 }}>
          Settings
        </Title>
        <Row gutter={[16, 16]}>
          {settingsSections.map((section) => (
            <Col xs={24} sm={12} lg={8} key={section.id}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  borderRadius: 8,
                  border: `2px solid ${
                    activeSection === section.id ? section.color : "#e8e8e8"
                  }`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  background:
                    activeSection === section.id
                      ? `${section.color}08`
                      : "#fff",
                }}
                styles={{
                  body: {
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }
                }}
                onClick={() => setActiveSection(section.id)}
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 32,
                        color: section.color,
                        marginBottom: 8,
                      }}
                    >
                      {section.icon}
                    </div>
                    {activeSection === section.id && (
                      <RightOutlined
                        style={{ color: section.color, fontSize: 18 }}
                      />
                    )}
                  </div>
                  <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                    {section.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {section.description}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  const renderActiveContent = () => {
    const activeSectionData = settingsSections.find(
      (s) => s.id === activeSection
    );

    if (!activeSectionData) return null;

    return (
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          minHeight: "500px",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <Space align="center" size="middle">
            <div
              style={{
                fontSize: 28,
                color: activeSectionData.color,
                display: "flex",
                alignItems: "center",
              }}
            >
              {activeSectionData.icon}
            </div>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {activeSectionData.title}
              </Title>
              <Text type="secondary">{activeSectionData.description}</Text>
            </div>
          </Space>
          <Divider style={{ margin: "16px 0" }} />
        </div>
        <div>{activeSectionData.component}</div>
      </Card>
    );
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {renderNavigation()}
      {renderActiveContent()}
    </div>
  );
};

export default Settings;
