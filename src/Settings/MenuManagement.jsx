import { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card, Typography, Space, Button, Tag } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import DraggableMenu from "../components/DraggableMenu";

const { Title, Text } = Typography;

const MenuManagement = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeType, setActiveType] = useState("main-categories");

  if (!user) {
    return <div>Loading...</div>;
  }

  const menuTypes = [
    {
      id: "main-categories",
      label: "Main Categories",
      icon: <AppstoreOutlined />,
      color: "#1890ff",
      description: "Reorder main menu categories",
    },
    {
      id: "sub-categories",
      label: "Sub Categories",
      icon: <UnorderedListOutlined />,
      color: "#52c41a",
      description: "Reorder sub menu categories",
    },
    {
      id: "items",
      label: "Items",
      icon: <ShoppingOutlined />,
      color: "#722ed1",
      description: "Reorder menu items",
    },
  ];

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>
            Select Menu Type to Reorder
          </Title>
          <Row gutter={[16, 16]}>
            {menuTypes.map((type) => (
              <Col xs={24} sm={8} key={type.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 8,
                    border: `2px solid ${
                      activeType === type.id ? type.color : "#e8e8e8"
                    }`,
                    background:
                      activeType === type.id ? `${type.color}08` : "#fff",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setActiveType(type.id)}
                >
                  <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <div
                      style={{
                        fontSize: 32,
                        color: type.color,
                        textAlign: "center",
                      }}
                    >
                      {type.icon}
                    </div>
                    <Title level={5} style={{ margin: 0, textAlign: "center" }}>
                      {type.label}
                    </Title>
                    <Text
                      type="secondary"
                      style={{ fontSize: 12, textAlign: "center", display: "block" }}
                    >
                      {type.description}
                    </Text>
                    {activeType === type.id && (
                      <Tag color={type.color} style={{ width: "100%", textAlign: "center" }}>
                        Active
                      </Tag>
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div style={{ marginTop: 24 }}>
          <DraggableMenu
            businessId={user.businessId}
            controller={activeType}
            type={activeType}
          />
        </div>
      </Space>
    </div>
  );
};

export default MenuManagement;
