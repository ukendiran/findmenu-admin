import {
  Avatar,
  Badge,
  Button,
  Divider,
  Dropdown,
  Layout,
  List,
  Space,
  Switch,
  Typography,
  App,
  theme,
  App,
  notification
} from "antd";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";



const { Header } = Layout;
const { Text } = Typography;

export default function TopNavBar({
  userData,
  configData,
  handleCollapsed,
  handleGoogleReview,
  collapsed,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token: { colorBgContainer } } = theme.useToken();
  const { notification } = App.useApp();

  // ✅ Sidebar toggle state
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const [notificationApi, contextHolder] = notification.useNotification();

  // ✅ Toggle sidebar function
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    handleCollapsed(!isCollapsed);
  };



  // ✅ Sample notifications (replace with real data)
  const notifications = [
    { id: 1, title: "New User", description: "John Doe registered", time: "2 min ago", read: false },
    { id: 2, title: "System Update", description: "Update completed", time: "1 hr ago", read: false },
  ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // ✅ Notification dropdown content
  const notificationContent = (
    <div style={{ width: 300, maxHeight: 400, overflow: "auto", backgroundColor: "#f0f2f5" }}>
      <div style={{ padding: "8px 16px" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Text strong>Notifications</Text>
          <Button type="link" size="small">Mark all as read</Button>
        </Space>
      </div>
      <Divider style={{ margin: "0" }} />
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item style={{ padding: "12px 16px" }}>
            <List.Item.Meta
              title={<Space>{!item.read && <Badge status="processing" />} {item.title}</Space>}
              description={<div><div>{item.description}</div><Text type="secondary" style={{ fontSize: "12px" }}>{item.time}</Text></div>}
            />
          </List.Item>
        )}
      />
    </div>
  );

  // ✅ Profile dropdown menu
  const profileMenu = {
    items: [
      { key: "settings", icon: <SettingOutlined />, label: "Settings" },
      { type: "divider" },
      { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
    ],
    onClick: ({ key }) => {
      if (key === "logout") {

        notificationApi.success(
          {
            message: "Logout Success",
            description: "Logged out successfully.",
            placement: "topRight"
          }
        );

        // Wait a bit before navigating to allow notification to show
        setTimeout(() => {
          dispatch(logout(userData));
          navigate("/login");
        }, 1000);

      } else {
        navigate(`/${key}`);
      }
    },
  };


  return (
    <App>
      {contextHolder}
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          type="text"
          icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{ fontSize: "16px", width: 64, height: 64 }}
        />

        {/* Top Right Menu */}
        <Space style={{ marginRight: 24 }}>
          Google Review
          <Switch checkedChildren="On" unCheckedChildren="Off" checked={configData?.googleReviewStatus === 1} onChange={handleGoogleReview} />
          <Dropdown disabled={true} trigger={["click"]} dropdownRender={() => notificationContent}>
            <Badge count={unreadCount} size="small">
              <Button type="text" icon={<BellOutlined style={{ fontSize: "18px" }} />} />
            </Badge>
          </Dropdown>
          <Dropdown menu={profileMenu}>
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              <span>{userData.name}</span>
            </Space>
          </Dropdown>
        </Space>
      </Header>
    </App>
  );
}

TopNavBar.propTypes = {
  userData: PropTypes.any,
  businessData: PropTypes.any,
  configData: PropTypes.any,
  collapsed: PropTypes.bool,
  handleCollapsed: PropTypes.func,
  handleGoogleReview: PropTypes.func,
};
