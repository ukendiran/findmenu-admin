import { useState, useEffect } from "react";
import {
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, notification, App } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TopNavBar from "./components/TopNavBar";
import { imageUrl } from "../utils/common";
import apiService from "../services/apiService";
import { logout } from "../store/slices/authSlice";
import CustomBreadcrumb from "./components/CustomBreadcrumb";

const { Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    window.location.href = '/login'
  }

  // Safely decrypt the token
  const user = token.data
  const [collapsed, setCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );
  const [restaurantData, setRestaurantData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);

  const {
    token: { borderRadiusLG, darkHeaderBg },
  } = theme.useToken();

  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (user && user.restaurantId) {
      getRestaurantData(user.restaurantId);
    }
    setSelectedKeys([location.pathname]);
  }, []);

  const getRestaurantData = async (restaurantId) => {
    try {
      const response = await apiService.get(`/restaurantconfig/${restaurantId}`);
      if (response.data.success) {
        setRestaurantData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    notificationApi.success({
      message: "Logout Success",
      description: "You have logged out successfully.",
      placement: "topRight",
    });
    navigate("/login");
  };

  const handleGoogleReview = async (checked) => {
    try {
      const newStatus = checked ? 1 : 2;
      console.log(`/restaurantconfig/${user.restaurantId}`)
      await apiService.put(`/restaurantconfig/${user.restaurantId}`, { googleReviewStatus: newStatus });
      if (checked) {
        notificationApi.success({ message: "Google Review", description: `Google Review ${checked ? "enabled" : "disabled"}.`, placement: "bottomRight" });
      } else {
        notificationApi.warning({ message: "Google Review", description: `Google Review ${checked ? "enabled" : "disabled"}.`, placement: "bottomRight" });
      }
      setRestaurantData((prev) => ({ ...prev, googleReviewStatus: newStatus }));
      getRestaurantData(user.restaurantId);
    } catch (error) {
      console.log(error)
      notificationApi.error({ message: "Update Failed", description: "Failed to update Google Review.", placement: "bottomRight" });
    }
  };


  const menuItems = [
    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard", path: "/admin/dashboard" },
    {
      key: "menus",
      icon: <UserOutlined />, label: "Menus",
      children: [
        { key: "/admin/menus/main-category", label: "Main Category", path: "/admin/menus/main-category" },
        { key: "/admin/menus/sub-category", label: "Sub Category", path: "/admin/menus/sub-category" },
        { key: "/admin/menus/items", label: "Items", path: "/admin/menus/items" },
      ],
    },
    {
      key: "others",
      icon: <SettingOutlined />, label: "Others",
      children: [
        { key: "/admin/feedback", label: "Feedback", path: "/admin/feedback" },
        { key: "/admin/import", label: "Import", path: "/admin/import" },
      ],
    },
    { key: "/admin/payments", icon: <TeamOutlined />, label: "Payments", path: "/admin/payments" },
    { key: "/admin/settings", icon: <SettingOutlined />, label: "Settings", path: "/admin/settings" },
    { key: "logout", icon: <SettingOutlined />, label: "Logout", onClick: handleLogout },
  ];

  const handleMenuClick = ({ key }) => {
    setSelectedKeys([key]);
    const menuItem = menuItems
      .flatMap((item) => (item.children ? item.children : item))
      .find((item) => item.key === key);

    if (menuItem && menuItem.path) {
      navigate(menuItem.path);
    } else if (key === "logout") {
      handleLogout();
    }
  };

  return (
    <App>
      {contextHolder}
      {user && (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => {
              setCollapsed(value);
              localStorage.setItem("sidebarCollapsed", JSON.stringify(value));
            }}
            theme="dark"
            style={{ height: "100vh", position: "fixed", left: 0, backgroundColor: darkHeaderBg }}
          >
            <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", background: darkHeaderBg }}>
              <img
                src={imageUrl("images/logo.png")}
                alt="Admin Panel"
                style={{ height: 40, cursor: "pointer" }}
                onClick={() => navigate("/admin/dashboard")}
              />
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selectedKeys}
              items={menuItems}
              onClick={handleMenuClick}
              style={{
                height: "100vh",
                overflowY: "auto", // Enables scrolling
                scrollbarWidth: "none", // Hides scrollbar in Firefox
                msOverflowStyle: "none", // Hides scrollbar in IE/Edge
              }}
            />

          </Sider>
          <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
            <TopNavBar
              restaurantData={restaurantData}
              userData={user}
              collapsed={collapsed}
              handleGoogleReview={handleGoogleReview}
              handleCollapsed={(val) => {
                setCollapsed(val);
                localStorage.setItem("sidebarCollapsed", JSON.stringify(val));
              }}
              handleLogout={handleLogout}
            />
            <Content style={{ margin: "24px 16px", padding: 24, borderRadius: borderRadiusLG, minHeight: 280 }}>
              <CustomBreadcrumb />
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      )}
    </App>
  );
};


export default AdminLayout;
