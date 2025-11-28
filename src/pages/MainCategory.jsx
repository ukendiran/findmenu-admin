import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Space,
  Button,
  Drawer,
  Form,
  Input,
  notification,
  Image,
  Switch,
  Modal,
  Upload,
  App,
  Row,
  Col,
  Card,
  Spin,
  Empty,
  Tag,
} from "antd";
import { useSelector } from "react-redux";
import { SearchOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import apiService from "../services/apiService";
import { checkImageNull } from "../utils/index";
import { extractErrorMessages } from "../utils/errorHelper";

const { Title } = Typography;


const MainCategory = () => {
  const { notification: notificationApi } = App.useApp();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(1);
  const [isAvailable, setIsAvailable] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);


  useEffect(() => {
    if (user?.businessId) {
      fetchCategories(user.businessId);
    }
  }, [user]);

  const fetchCategories = useCallback(async (businessId) => {
    try {
      setLoading(true);
      const response = await apiService.get(`/main-categories`, { businessId });
      if (response.data?.data) {
        const dataWithKeys = response.data.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));
        setData(dataWithKeys);
        setFilteredData(dataWithKeys);

      }
    } catch (error) {
      notificationApi.error({
        message: "Fetch Error",
        description: extractErrorMessages(error, 'Failed to load categories'),
      });
    } finally {
      setLoading(false);

    }
  }, [notificationApi]);

  const showDrawer = (record = null) => {
    console.log("showDrawer", record);
    setCurrentRecord(record);
    setStatus(record?.status ?? 1); // 1 or 2
    setIsAvailable(record?.isAvailable ?? 1);
    if (record) {
      form.setFieldsValue(record);
      setImageFile({
        url: checkImageNull(record.image),
        name: record.image
      });
    } else {
      form.resetFields();
      setImageFile(null);
    }
    setIsDrawerVisible(true);
  };

  const handleDrawerCancel = () => {
    setIsDrawerVisible(false);
    setCurrentRecord(null);
    setImageFile(null);
    form.resetFields();
  };

  const handleImageUpload = (info) => {
    const file = info.file;
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage || !isLt2M) {
      notificationApi.error({
        message: "Upload Error",
        description: isImage ? "Image must be smaller than 2MB!" : "Only image files are allowed",
      });
      return false;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile({
        file: file,
        url: reader.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    return false;
  };



  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      // formData.append('description', values.description);
      if (status === 1) {
        formData.append("status", 1);
      } else {
        formData.append("status", 2);
      }
      if (isAvailable === 1) {
        formData.append("isAvailable", 1);
      } else {
        formData.append("isAvailable", 2);
      }
      formData.append('businessId', user.businessId);
      if (imageFile?.file) {
        formData.append('image', imageFile.originFileObj);
      }

      if (currentRecord?.id) {
        formData.append('_method', 'PUT');
        await apiService.post(`/main-categories/${currentRecord.id}`, formData);
        notificationApi.success({ message: "Updated", description: "Category updated successfully!" });
      } else {
        formData.append('_method', 'POST');
        await apiService.post(`/main-categories`, formData);
        notificationApi.success({ message: "Created", description: "Category created successfully!" });
      }

      fetchCategories(user.businessId);
      handleDrawerCancel();
    } catch (error) {
      notificationApi.error({
        message: "Save Failed",
        description: extractErrorMessages(error, 'Unable to save category'),
      });
    }
  };



  const handleStatus = async (checked, record) => {
    try {
      const status = checked ? 1 : 2;
      await apiService.put(`/main-categories/${record.id}`, { status, businessId: user.businessId });

      setFilteredData((prevState) =>
        prevState.map((item) => (item.id === record.id ? { ...item, status } : item))
      );

      notificationApi.success({
        message: "Status Updated",
        description: `Category "${record.name}" has been ${checked ? "enabled" : "disabled"}.`,

      });
    } catch (error) {
      notificationApi.error({
        message: "Update Failed",
        description: error.response?.data?.message || "Failed to update category status",

      });
    }
  };

  const handleAvailablity = async (checked, record) => {
    try {
      const isAvailable = checked ? 1 : 2;
      await apiService.put(`/main-categories/${record.id}`, { isAvailable, businessId: user.businessId });

      setFilteredData((prevState) =>
        prevState.map((item) => (item.id === record.id ? { ...item, isAvailable } : item))
      );

      notificationApi.success({
        message: "Availability Updated",
        description: `Category "${record.name}" is  ${checked ? "now available" : "change to unavailable"}.`,

      });
    } catch {
      notificationApi.error({
        message: "Update Failed",
        description: "Failed to update category availability.",
      });
    }
  };


  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };


  const handleDelete = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };


  const confirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      await apiService.delete(`/main-categories/${recordToDelete.id}`);
      notificationApi.success({
        message: "Deleted",
        description: "Category deleted successfully!",
      });
      fetchCategories(user.businessId);
    } catch (error) {
      notificationApi.error({
        message: "Delete Failed",
        description: error.response?.data?.message || "Unable to delete category",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setRecordToDelete(null);
  };


  return (
    <>
      <Title level={2}>Main Category List</Title>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Input
          placeholder="Search Item Name"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
        <Button type="primary" onClick={() => showDrawer()}>
          Add Category
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : filteredData.length === 0 ? (
        <Empty description="No categories found" style={{ padding: "60px 0" }} />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredData.map((record) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={record.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                cover={
                  <div
                    style={{
                      height: 200,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Image
                      src={checkImageNull(record.image)}
                      alt={record.name}
                      preview={false}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                  </div>
                }
                actions={[
                  <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => showDrawer(record)}
                  >
                    Edit
                  </Button>,
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record)}
                  >
                    Delete
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>{record.name}</span>
                    </div>
                  }
                  description={
                    <Space direction="vertical" size="small" style={{ width: "100%", marginTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#666" }}>Status:</span>
                        <Switch
                          checkedChildren="On"
                          unCheckedChildren="Off"
                          checked={record.status === 1}
                          onChange={(checked) => handleStatus(checked, record)}
                          size="small"
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#666" }}>Availability:</span>
                        <Switch
                          checkedChildren="On"
                          unCheckedChildren="Off"
                          checked={record.isAvailable === 1}
                          onChange={(checked) => handleAvailablity(checked, record)}
                          size="small"
                        />
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <Tag color={record.status === 1 ? "success" : "default"}>
                          {record.status === 1 ? "Active" : "Inactive"}
                        </Tag>
                        <Tag color={record.isAvailable === 1 ? "blue" : "default"}>
                          {record.isAvailable === 1 ? "Available" : "Unavailable"}
                        </Tag>
                      </div>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Drawer
        title={currentRecord ? "Edit Category" : "Add Category"}
        placement="right"
        open={isDrawerVisible}
        onClose={handleDrawerCancel}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter the category name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item label="Status">
            <Switch
              checked={status == 1}
              onChange={checked => setStatus(checked ? 1 : 2)}
              checkedChildren="On"
              unCheckedChildren="Off"
            />
          </Form.Item>

          <Form.Item label="Availablity">
            <Switch
              checked={isAvailable === 1}
              onChange={checked => setIsAvailable(checked ? 1 : 2)}
              checkedChildren="On"
              unCheckedChildren="Off"
            />
          </Form.Item>


          <Form.Item name="image" label="Category Image" style={{ display: 'none' }}>
            <Space direction="horizontal" align="start">
              <Image
                width={150}
                src={imageFile?.url || checkImageNull(null)}
                alt="Category Image"
              />
              <Upload
                accept="image/*"
                beforeUpload={() => false}
                onChange={handleImageUpload}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Space>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "40%", margin: '5%' }}
            >
              Save
            </Button>
            <Button
              onClick={handleDrawerCancel}
              style={{ width: "40%" }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Delete Category"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Yes"
        cancelText="No"
        okType="danger"
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>

    </>
  );
};

export default MainCategory;