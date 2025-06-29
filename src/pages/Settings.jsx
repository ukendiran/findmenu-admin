import { Tabs, Typography } from "antd";
import { useSelector } from "react-redux";
import BusinessDetails from "../Settings/BusinessDetails";
import Notifications from "../Settings/Notifications";
import QRCodePage from "../Settings/QRCodePage";
import MenuManagement from "../Settings/MenuManagement";
const { Title } = Typography

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
  const business = useSelector((state) => state.auth.business);
  if (!user) {
    return <p>Loading user data...</p>; // ✅ Prevents rendering before `user` is available
  }

  // Define the tabs as an array of objects
  const tabItems = [
    {
      key: "1",
      label: "Business Details",
      children: <BusinessDetails businessId={user.businessId} />,
    },
    {
      key: "2",
      label: "Notifications",
      children: <Notifications userData={user.businessId} />,
    },
    {
      key: "3",
      label: "QR Code",
      children: <QRCodePage businessCode={business.code} />,
    },
    {
      key: "4",
      label: "Menu Management",
      children: <MenuManagement businessId={user.businessId} />,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <Title level={2}>Business Settings</Title>
      <Tabs defaultActiveKey="1" items={tabItems} tabPosition="top" />
    </div>
  );
};

export default Settings;
