import { Menu } from "antd";
import { HomeOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function SiderMenu() {
  const navigate = useNavigate();

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      onClick={({ key }) => navigate(key)}
      items={[
        { key: "/", icon: <HomeOutlined />, label: "Dashboard" },
        { key: "/categories", icon: <AppstoreOutlined />, label: "Categories" },
      ]}
    />
  );
}
