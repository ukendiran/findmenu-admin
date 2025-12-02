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
    theme
} from "antd";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import apiService from "../services/apiService";
import dayjs from "dayjs";



const { Header } = Layout;
const { Text } = Typography;

export default function TopNavBar({
  userData,
  configData,
  handleCollapsed,
  handleGoogleReview,
  handleLogout,
  collapsed,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token: { colorBgContainer } } = theme.useToken();
  const { notification: notificationApi } = App.useApp();
  const user = useSelector((state) => state.auth.user);

  // ✅ Sidebar toggle state
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // ✅ Toggle sidebar function
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    handleCollapsed(!isCollapsed);
  };

  // ✅ Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.businessId) return;

    setLoadingNotifications(true);
    try {
      const response = await apiService.get(`/notifications`, {
        businessId: user.businessId,
        status: 1, // Only unread notifications
      });

      if (response.data?.data) {
        setNotifications(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user?.businessId]);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.length;

  // ✅ Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiService.put(`/notifications/${notificationId}/mark-read`);
      // Remove from list
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      notificationApi.success({
        message: "Success",
        description: "Notification marked as read",
      });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      notificationApi.error({
        message: "Error",
        description: "Failed to mark notification as read",
      });
    }
  };

  // ✅ Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!user?.businessId || notifications.length === 0) return;

    try {
      await apiService.put(`/notifications/mark-all-read`, {
        businessId: user.businessId,
      });
      setNotifications([]);
      notificationApi.success({
        message: "Success",
        description: "All notifications marked as read",
      });
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      notificationApi.error({
        message: "Error",
        description: "Failed to mark all notifications as read",
      });
    }
  };

  // ✅ Notification dropdown content
  const notificationContent = (
    <div style={{ width: 300, maxHeight: 400, overflow: "auto", backgroundColor: "#f0f2f5" }}>
      <div style={{ padding: "8px 16px" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Text strong>Notifications</Text>
          {notifications.length > 0 && (
            <Button type="link" size="small" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </Space>
      </div>
      <Divider style={{ margin: "0" }} />
      {loadingNotifications ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">Loading...</Text>
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">No new notifications</Text>
        </div>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                backgroundColor: item.status === 1 ? "#f0f7ff" : "#fff",
              }}
              onClick={() => handleMarkAsRead(item.id)}
            >
              <List.Item.Meta
                title={
                  <Space>
                    {item.status === 1 && <Badge status="processing" />}
                    <Text>{item.message || "Notification"}</Text>
                  </Space>
                }
                description={
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {dayjs(item.created_at).format("MMM D, YYYY h:mm A")}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
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
        // Use the handleLogout prop from AdminLayout to avoid duplicate notifications
        if (handleLogout) {
          handleLogout();
        } else {
          // Fallback if handleLogout is not provided
          notificationApi.success({
            message: "Logout Success",
            description: "Logged out successfully.",
            placement: "topRight"
          });
          setTimeout(() => {
            dispatch(logout(userData));
            navigate("/login");
          }, 1000);
        }
      } else {
        navigate(`/${key}`);
      }
    },
  };


  return (
    <>
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
          <Dropdown trigger={["click"]} dropdownRender={() => notificationContent}>
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
    </>
  );
}

TopNavBar.propTypes = {
  userData: PropTypes.any,
  businessData: PropTypes.any,
  configData: PropTypes.any,
  collapsed: PropTypes.bool,
  handleCollapsed: PropTypes.func,
  handleGoogleReview: PropTypes.func,
  handleLogout: PropTypes.func,
};
