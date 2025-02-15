import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { App, Button, notification } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import apiService from "../../services/apiService";

const ItemType = "ITEM";

const DraggableItem = ({ item, index, moveItem }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        border: "1px solid #ddd",
        marginBottom: "4px",
        background: "white",
        borderRadius: "4px",
      }}
    >
      {item.name}

      <Button
        icon={<MenuOutlined />}
        type="text"
        style={{ marginRight: "10px", cursor: "grab" }}
      />
    </div>
  );
};

const DraggableMenu = ({ restaurantId, controller }) => {
  const [loading, setLoading] = useState(true);
  const [mainCategory, setMainCategory] = useState([]);
  const [notificationApi, contextHolder] = notification.useNotification();

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...mainCategory];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);

    // Update menuOrderId based on new order
    const reorderedItems = updatedItems.map((item, idx) => ({
      ...item,
      menuOrderId: idx + 1,
    }));

    setMainCategory(reorderedItems);
  };

  const saveOrder = async () => {
    const filteredData = mainCategory.map(({ id, menuOrderId }) => ({
      id,
      menuOrderId,
    }));
    console.log(filteredData);

    try {
      const response = await apiService.post(`/${controller}/updatemenuorder`, {
        updateData: filteredData,
      });
      console.log(response.data.data);
      if (response.data.success) {
        notificationApi.success({
          message: "Menu ordering",
          description: "Menu Ordering updated Successfully.",
          placement: "bottomRight",
        });
      } else {
        notificationApi.error({ message: "Error", description: "Error on Update", placement: "bottomRight" });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getMainCategory();
    console.log(mainCategory, loading);
  }, []);

  const getMainCategory = async () => {
    try {
      let action = "getbyrestaurant";
      if (controller == "items") {
        action = "getitems";
      }
      const response = await apiService.post(`/${controller}/${action}`, {
        restaurantId: restaurantId,
      });

      if (response.data) {
        setMainCategory(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <App>
      {contextHolder}

      <DndProvider backend={HTML5Backend}>
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
          <h2>Draggable Menu</h2>
          {mainCategory &&
            mainCategory.map((item, index) => (
              <DraggableItem
                key={item.id}
                index={index}
                item={item}
                moveItem={moveItem}
              />
            ))}
          <Button
            type="primary"
            onClick={saveOrder}
            style={{ marginTop: "10px" }}
          >
            Save Menu Order
          </Button>
        </div>
      </DndProvider>
    </App>
  );
};
DraggableMenu.propTypes = {
  restaurantId: PropTypes.any,
  controller: PropTypes.any,
};

DraggableItem.propTypes = {
  item: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  moveItem: PropTypes.func.isRequired,
};

export default DraggableMenu;
