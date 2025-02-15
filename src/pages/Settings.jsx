import { Tabs, Typography } from "antd";
import { useSelector } from "react-redux";
import RestaurantDetails from "../Settings/RestaurantDetails";
import Notifications from "../Settings/Notifications";
import QRCodePage from "../Settings/QRCodePage";
import MenuManagement from "../Settings/MenuManagement";
const { Title } = Typography

const Settings = () => {
  const token = useSelector((state) => state.auth.token);
  const user = token.data;



  if (!user) {
    return <p>Loading user data...</p>; // ✅ Prevents rendering before `user` is available
  }

  // Define the tabs as an array of objects
  const tabItems = [
    {
      key: "1",
      label: "Restaurant Details",
      children: <RestaurantDetails restaurantId={user.restaurantId} />,
    },
    {
      key: "2",
      label: "Notifications",
      children: <Notifications userData={user.restaurantId} />,
    },
    {
      key: "3",
      label: "QR Code",
      children: <QRCodePage restaurantCode={user.restaurantCode} />,
    },
    {
      key: "4",
      label: "Menu Management",
      children: <MenuManagement restaurantId={user.restaurantId} />,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <Title level={2}>Restaurant Settings</Title>
      <Tabs defaultActiveKey="1" items={tabItems} tabPosition="top" />
    </div>
  );
};

export default Settings;
