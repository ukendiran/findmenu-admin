import { PropTypes } from "prop-types";
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import DraggableMenu from "../MenuManagement/DraggableMenu";

const MenuManagement = () => {
  const token = useSelector((state) => state.auth.token);
  const user = token.data;
  useEffect(() => {
    console.log(user.restaurantId);
  }, [user]);

  // Define the tabs as an array of objects
  const tabItems = [
    {
      key: "1",
      label: "Main Category",
      children: (
        <DraggableMenu
          restaurantId={user.restaurantId}
          controller="maincategory"
        />
      ),
    },

    {
      key: "2",
      label: "Sub Category",
      children: (
        <DraggableMenu
          restaurantId={user.restaurantId}
          controller="subcategory"
        />
      ),
    },
    {
      key: "3",
      label: "Items",
      children: (
        <DraggableMenu restaurantId={user.restaurantId} controller="items" />
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
  restaurantId: PropTypes.any,

};


export default MenuManagement;
