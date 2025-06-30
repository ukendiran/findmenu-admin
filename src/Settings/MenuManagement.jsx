import { PropTypes } from "prop-types";
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import DraggableMenu from "../components/DraggableMenu";


const MenuManagement = () => {
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    console.log(user.businessId);
  }, [user]);

  // Define the tabs as an array of objects
  const tabItems = [
    {
      key: "1",
      label: "Main Category",
      children: (
        <DraggableMenu
          businessId={user.businessId}
          controller="main-categories"
        />
      ),
    },

    {
      key: "2",
      label: "Sub Category",
      children: (
        <DraggableMenu
          businessId={user.businessId}
          controller="sub-categories"
        />
      ),
    },
    {
      key: "3",
      label: "Items",
      children: (
        <DraggableMenu businessId={user.businessId} controller="items" />
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      {user && (
        <Tabs defaultActiveKey="1" items={tabItems} tabPosition="left" />
      )}
    </div>
  );
};

MenuManagement.propTypes = {
  businessId: PropTypes.any,

};


export default MenuManagement;
