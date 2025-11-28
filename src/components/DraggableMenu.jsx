import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  App,
  Button,
  Row,
  Col,
  Card,
  Image,
  Typography,
  Space,
  Tag,
  Spin,
  Empty,
  Modal,
  InputNumber,
  message,
  Select,
  Divider,
  Badge,
} from "antd";
import {
  MenuOutlined,
  DragOutlined,
  SaveOutlined,
  ReloadOutlined,
  SwapOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import apiService from "../services/apiService";
import { extractErrorMessages } from "../utils/errorHelper";
import { checkImageNull } from "../utils/index";

const { Text, Title } = Typography;
const { Option } = Select;
const ItemType = "MENU_ITEM";

const DraggableItem = ({ item, index, moveItem, type, isDragging, onMoveClick, totalItems }) => {
  const [{ isDragging: dragIsDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, id: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const opacity = dragIsDragging ? 0.4 : 1;

  return (
    <Col xs={24} sm={12} md={8} lg={6} xl={6} style={{ marginBottom: 16 }}>
      <div
        ref={(node) => drag(drop(node))}
        style={{
          opacity,
          cursor: "grab",
          transition: "all 0.3s ease",
          transform: isOver ? "scale(1.05)" : "scale(1)",
        }}
      >
        <Card
          hoverable
          style={{
            borderRadius: 8,
            boxShadow: dragIsDragging
              ? "0 8px 16px rgba(0,0,0,0.2)"
              : isOver
              ? "0 4px 12px rgba(24, 144, 255, 0.3)"
              : "0 2px 8px rgba(0,0,0,0.1)",
            border: isOver ? "2px solid #1890ff" : "1px solid #e8e8e8",
            background: isOver ? "#e6f7ff" : "#fff",
            height: "100%",
            position: "relative",
          }}
        >
          <Space
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
            }}
          >
            <Button
              type="text"
              icon={<SwapOutlined />}
              size="small"
              style={{
                background: "rgba(24, 144, 255, 0.9)",
                color: "#fff",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onMoveClick(item, index);
              }}
              title="Move to position"
            />
            <Button
              type="text"
              icon={<DragOutlined />}
              size="small"
              style={{
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "grab",
              }}
              title="Drag to reorder"
            />
          </Space>

          <div
            style={{
              height: 150,
              overflow: "hidden",
              borderRadius: 6,
              marginBottom: 12,
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={checkImageNull(item.image)}
              alt={item.name}
              preview={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          </div>

          <div style={{ paddingTop: 8 }}>
            <Text
              strong
              style={{
                fontSize: 14,
                display: "block",
                marginBottom: 8,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.name}
            </Text>

            {type === "sub-categories" && item.category?.name && (
              <Text
                type="secondary"
                style={{ fontSize: 11, display: "block", marginBottom: 4 }}
              >
                Category: {item.category.name}
              </Text>
            )}

            {type === "items" && (
              <>
                {item.category?.name && (
                  <Text
                    type="secondary"
                    style={{ fontSize: 11, display: "block", marginBottom: 2 }}
                  >
                    Cat: {item.category.name}
                  </Text>
                )}
                {item.sub_category?.name && (
                  <Text
                    type="secondary"
                    style={{ fontSize: 11, display: "block", marginBottom: 4 }}
                  >
                    Sub: {item.sub_category.name}
                  </Text>
                )}
                {item.price && (
                  <Text
                    strong
                    style={{
                      fontSize: 14,
                      color: "#1890ff",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    ₹{item.price}
                  </Text>
                )}
              </>
            )}

            <Space size="small" style={{ marginTop: 8 }}>
              <Tag color={item.status === 1 ? "success" : "default"}>
                {item.status === 1 ? "Active" : "Inactive"}
              </Tag>
              {item.menuOrderId && (
                <Tag color="blue">#{item.menuOrderId}</Tag>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </Col>
  );
};

const DraggableMenu = ({ businessId, controller, type = "main-categories" }) => {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [targetPosition, setTargetPosition] = useState(1);
  
  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  
  const { notification: notificationApi } = App.useApp();

  const getEndpoint = () => {
    switch (controller) {
      case "main-categories":
        return "/main-categories";
      case "sub-categories":
        return "/sub-categories-with-category";
      case "items":
        return "/items-with-category";
      default:
        return `/${controller}`;
    }
  };

  const fetchCategories = useCallback(async () => {
    if (type === "main-categories") return;
    
    try {
      const response = await apiService.get("/main-categories", {
        businessId: businessId,
      });
      if (response.data?.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [businessId, type]);

  const fetchSubCategories = useCallback(async (categoryId) => {
    if (type !== "items" || !categoryId) {
      setSubCategories([]);
      return;
    }
    
    try {
      const response = await apiService.get("/sub-categories", {
        businessId: businessId,
        categoryId: categoryId,
      });
      if (response.data?.data) {
        setSubCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  }, [businessId, type]);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = getEndpoint();
      const response = await apiService.get(endpoint, {
        businessId: businessId,
      });

      if (response.data?.data) {
        // Sort by menuOrderId if available, otherwise keep original order
        const sorted = [...response.data.data].sort((a, b) => {
          const orderA = a.menuOrderId || 9999;
          const orderB = b.menuOrderId || 9999;
          return orderA - orderB;
        });
        setAllItems(sorted);
        // Apply filters after setting allItems
        setTimeout(() => {
          applyFilters(sorted);
        }, 0);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      notificationApi.error({
        message: "Error",
        description: "Failed to load menu items. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [businessId, controller, notificationApi]);

  const applyFilters = useCallback((itemsToFilter = null) => {
    const sourceItems = itemsToFilter || allItems;
    if (!sourceItems || sourceItems.length === 0) {
      setItems([]);
      return;
    }

    let filtered = [...sourceItems];

    // Filter by category for sub-categories and items
    if (type === "sub-categories" && selectedCategoryId) {
      filtered = filtered.filter(
        (item) => item.categoryId === selectedCategoryId
      );
    }

    // Filter by category and subcategory for items
    if (type === "items") {
      if (selectedCategoryId) {
        filtered = filtered.filter(
          (item) => item.categoryId === selectedCategoryId
        );
      }
      if (selectedSubCategoryId) {
        filtered = filtered.filter(
          (item) => item.subCategoryId === selectedSubCategoryId
        );
      }
    }

    // Maintain order within filtered results
    const filteredWithOrder = filtered.map((item, idx) => ({
      ...item,
      filteredOrder: idx + 1,
    }));

    setItems(filteredWithOrder);
  }, [type, selectedCategoryId, selectedSubCategoryId, allItems]);

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, [fetchItems, fetchCategories]);

  useEffect(() => {
    if (selectedCategoryId && type === "items") {
      fetchSubCategories(selectedCategoryId);
    } else {
      setSubCategories([]);
      setSelectedSubCategoryId(null);
    }
  }, [selectedCategoryId, type, fetchSubCategories]);

  useEffect(() => {
    if (allItems.length > 0) {
      applyFilters(allItems);
    }
  }, [selectedCategoryId, selectedSubCategoryId, allItems, applyFilters]);

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);

    // Update menuOrderId based on new order within filtered items
    const reorderedItems = updatedItems.map((item, idx) => ({
      ...item,
      menuOrderId: idx + 1,
      filteredOrder: idx + 1,
    }));

    setItems(reorderedItems);
    setHasChanges(true);
  };


  const resetOrder = () => {
    fetchItems();
    setHasChanges(false);
  };

  const handleMoveClick = (item, index) => {
    setSelectedItem(item);
    setSelectedItemIndex(index);
    setTargetPosition(item.menuOrderId || index + 1);
    setMoveModalVisible(true);
  };

  const handleMoveConfirm = () => {
    if (!selectedItem || targetPosition < 1 || targetPosition > items.length) {
      message.error(`Please enter a valid position between 1 and ${items.length}`);
      return;
    }

    const currentPosition = selectedItemIndex + 1;
    if (targetPosition === currentPosition) {
      setMoveModalVisible(false);
      return;
    }

    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(selectedItemIndex, 1);
    updatedItems.splice(targetPosition - 1, 0, movedItem);

    // Update menuOrderId based on new order within filtered items
    const reorderedItems = updatedItems.map((item, idx) => ({
      ...item,
      menuOrderId: idx + 1,
      filteredOrder: idx + 1,
    }));

    setItems(reorderedItems);
    setHasChanges(true);
    setMoveModalVisible(false);
    message.success(`Moved "${selectedItem.name}" to position ${targetPosition}`);
  };

  const handleClearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setSubCategories([]);
  };

  const handleSaveOrder = async () => {
    // When saving, we need to update the order in the context of all items
    // For filtered items, we update their order relative to their filter group
    const filteredData = items.map(({ id, menuOrderId }) => ({
      id,
      menuOrderId,
    }));

    try {
      setSaving(true);
      const response = await apiService.post(`/${controller}/menu-order`, {
        updateData: filteredData,
      });

      if (response.data.success) {
        notificationApi.success({
          message: "Success",
          description: "Menu order updated successfully!",
        });
        setHasChanges(false);
        fetchItems();
      } else {
        notificationApi.error({
          message: "Error",
          description: "Failed to update menu order",
        });
      }
    } catch (error) {
      notificationApi.error({
        message: "Error",
        description: extractErrorMessages(error, "Error saving. Please try again."),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMoveCancel = () => {
    setMoveModalVisible(false);
    setSelectedItem(null);
    setSelectedItemIndex(null);
    setTargetPosition(1);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  const hasActiveFilters = selectedCategoryId || selectedSubCategoryId;

  return (
    <DndProvider backend={HTML5Backend}>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Reorder Menu Items
              </Title>
              <Text type="secondary">
                {items.length} of {allItems.length} item{items.length !== 1 ? "s" : ""} shown
              </Text>
            </div>
            <Space>
              {hasChanges && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={resetOrder}
                  disabled={saving}
                >
                  Reset
                </Button>
              )}
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveOrder}
                loading={saving}
                disabled={!hasChanges || items.length === 0}
              >
                Save Order
              </Button>
            </Space>
          </div>

          {/* Filter Section */}
          {(type === "sub-categories" || type === "items") && (
            <Card
              style={{
                background: "#f5f5f5",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FilterOutlined style={{ color: "#1890ff" }} />
                  <Text strong>Filter Options</Text>
                  {hasActiveFilters && (
                    <Badge count={[selectedCategoryId, selectedSubCategoryId].filter(Boolean).length} />
                  )}
                </div>
                <Row gutter={[16, 16]}>
                  {type === "sub-categories" && (
                    <Col xs={24} sm={12} md={8}>
                      <Text strong style={{ display: "block", marginBottom: 8 }}>
                        Main Category
                      </Text>
                      <Select
                        placeholder="Select category to filter"
                        style={{ width: "100%" }}
                        allowClear
                        value={selectedCategoryId}
                        onChange={(value) => {
                          setSelectedCategoryId(value);
                          setSelectedSubCategoryId(null);
                        }}
                      >
                        {categories.map((cat) => (
                          <Option key={cat.id} value={cat.id}>
                            {cat.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  )}

                  {type === "items" && (
                    <>
                      <Col xs={24} sm={12} md={8}>
                        <Text strong style={{ display: "block", marginBottom: 8 }}>
                          Main Category
                        </Text>
                        <Select
                          placeholder="Select category (optional)"
                          style={{ width: "100%" }}
                          allowClear
                          value={selectedCategoryId}
                          onChange={(value) => {
                            setSelectedCategoryId(value);
                            setSelectedSubCategoryId(null);
                          }}
                        >
                          {categories.map((cat) => (
                            <Option key={cat.id} value={cat.id}>
                              {cat.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Text strong style={{ display: "block", marginBottom: 8 }}>
                          Sub Category
                        </Text>
                        <Select
                          placeholder="Select sub category (optional)"
                          style={{ width: "100%" }}
                          allowClear
                          value={selectedSubCategoryId}
                          onChange={setSelectedSubCategoryId}
                          disabled={!selectedCategoryId}
                        >
                          {subCategories.map((subCat) => (
                            <Option key={subCat.id} value={subCat.id}>
                              {subCat.name}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </>
                  )}

                  {hasActiveFilters && (
                    <Col xs={24} sm={12} md={8}>
                      <Text strong style={{ display: "block", marginBottom: 8 }}>
                        Actions
                      </Text>
                      <Button
                        icon={<ClearOutlined />}
                        onClick={handleClearFilters}
                        style={{ width: "100%" }}
                      >
                        Clear Filters
                      </Button>
                    </Col>
                  )}
                </Row>
              </Space>
            </Card>
          )}

          {hasActiveFilters && (
            <div
              style={{
                padding: 12,
                background: "#e6f7ff",
                borderRadius: 6,
                border: "1px solid #91d5ff",
                marginBottom: 16,
              }}
            >
              <Text>
                ℹ️ Showing filtered results. Only items matching your filters will be reordered.
              </Text>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <Empty description="No items to reorder" />
        ) : (
          <Row gutter={[16, 16]}>
            {items.map((item, index) => (
              <DraggableItem
                key={item.id}
                index={index}
                item={item}
                moveItem={moveItem}
                type={type}
                onMoveClick={handleMoveClick}
                totalItems={items.length}
              />
            ))}
          </Row>
        )}

        <Modal
          title={
            <Space>
              <SwapOutlined />
              <span>Move Item to Position</span>
            </Space>
          }
          open={moveModalVisible}
          onOk={handleMoveConfirm}
          onCancel={handleMoveCancel}
          okText="Move"
          cancelText="Cancel"
        >
          {selectedItem && (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Text strong>Item:</Text>
                <div style={{ marginTop: 8, padding: 12, background: "#f5f5f5", borderRadius: 6 }}>
                  <Text>{selectedItem.name}</Text>
                  {selectedItem.menuOrderId && (
                    <Tag color="blue" style={{ marginLeft: 8 }}>
                      Current Position: #{selectedItem.menuOrderId}
                    </Tag>
                  )}
                </div>
              </div>
              <div>
                <Text strong>Move to Position:</Text>
                <InputNumber
                  min={1}
                  max={items.length}
                  value={targetPosition}
                  onChange={(value) => setTargetPosition(value || 1)}
                  style={{ width: "100%", marginTop: 8 }}
                  placeholder={`Enter position (1-${items.length})`}
                />
                <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                  Enter a number between 1 and {items.length} (within filtered results)
                </Text>
              </div>
            </Space>
          )}
        </Modal>

        {hasChanges && (
          <div
            style={{
              marginTop: 24,
              padding: 12,
              background: "#fff7e6",
              borderRadius: 6,
              border: "1px solid #ffd591",
            }}
          >
            <Text>
              ⚠️ You have unsaved changes. Click "Save Order" to apply them.
            </Text>
          </div>
        )}
      </Card>
    </DndProvider>
  );
};
DraggableMenu.propTypes = {
  businessId: PropTypes.any,
  controller: PropTypes.any,
};

DraggableItem.propTypes = {
  item: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  moveItem: PropTypes.func.isRequired,
  type: PropTypes.string,
  isDragging: PropTypes.bool,
  onMoveClick: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
};

DraggableMenu.propTypes = {
  businessId: PropTypes.any.isRequired,
  controller: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default DraggableMenu;
