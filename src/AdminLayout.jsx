import { useState, useEffect } from "react";
import {
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, notification, App, Spin } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TopNavBar from "./components/TopNavBar";
import apiService from "./services/apiService";
import { logout, updateConfig } from "./store/slices/authSlice";
import CustomBreadcrumb from "./components/CustomBreadcrumb";

const { Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const business = useSelector((state) => state.auth.business);
  const config = useSelector((state) => state.auth.config);

  const [collapsed, setCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );
  const [businessData, setBusinessData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);

  const {
    token: { borderRadiusLG, darkHeaderBg },
  } = theme.useToken();

  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    setBusinessData(business || []);
    setSelectedKeys([location.pathname]);
  }, [business, location.pathname]);


  if (user === undefined) {
    return <Spin fullscreen />;
  }

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
      const config = await apiService.put(`/config/${user.businessId}`, { googleReviewStatus: newStatus });
      if (checked) {
        notificationApi.success({ message: "Google Review", description: `Google Review ${checked ? "enabled" : "disabled"}.`, placement: "bottomRight" });
      } else {
        notificationApi.warning({ message: "Google Review", description: `Google Review ${checked ? "enabled" : "disabled"}.`, placement: "bottomRight" });
      }
      // setBusinessData((prev) => ({ ...prev, googleReviewStatus: newStatus }));
      setBusinessData(config.data.data);
      dispatch(updateConfig(config.data.data));

    } catch (error) {
      console.log(error)
      notificationApi.error({ message: "Update Failed", description: "Failed to update Google Review.", placement: "bottomRight" });
    }
  };


  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard", path: "/dashboard" },
    {
      key: "menus",
      icon: <UserOutlined />, label: "Menus",
      children: [
        { key: "/menus/main-category", label: "Main Category", path: "/menus/main-category" },
        { key: "/menus/sub-category", label: "Sub Category", path: "/menus/sub-category" },
        { key: "/menus/items", label: "Items", path: "/menus/items" },
      ],
    },    
    { key: "/feedback", icon: <MessageOutlined />, label: "Feedback", path: "/feedback" },
    { key: "/settings", icon: <SettingOutlined />, label: "Settings", path: "/settings" },
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
                src={`${apiService.apiUrl}/images/logo.png`}
                alt="Admin Panel"
                style={{ height: 40, cursor: "pointer" }}
                onClick={() => navigate("/dashboard")}
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
              businessData={businessData}
              configData={config}
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
