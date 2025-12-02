import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Space,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Image,
  Switch,
  Modal,
  App,
  Upload,
  Row,
  Col,
  Card,
  Spin,
  Empty,
  Tag,
} from "antd";


import { useSelector } from "react-redux";
import apiService from "../services/apiService";

import { SearchOutlined, UploadOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { checkImageNull, genarateIndexKey } from "../utils/index";
import { extractErrorMessages } from "../utils/errorHelper";


const { Title } = Typography;
const { Option } = Select;

const SubCategory = () => {
  const { notification: notificationApi } = App.useApp();
  const user = useSelector((state) => state.auth.user);
  const business = useSelector((state) => state.auth.business);
  const [data, setData] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false); // Use Drawer visibility
  const [currentRecord, setCurrentRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [category, setCategory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [status, setStatus] = useState(1);
  const [isAvailable, setIsAvailable] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const fetchSubCategories = useCallback(async (businessId) => {
    try {
      setLoading(true)
      const response = await apiService.get(`/sub-categories-with-category`, {
        businessId,
      });
      if (response.data?.data) {
        const dataWithKeys = response.data.data.map((item, index) => ({
          ...item,
          key: genarateIndexKey(item.name, index)
        }));
        setData(dataWithKeys);
        setFilteredData(dataWithKeys);
      }
    } catch (error) {
      console.error("Error fetching sub categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.businessId) {
      fetchSubCategories(user.businessId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.businessId]);



  const fetchCategories = useCallback(async (businessId) => {
    if (!businessId) return;
    try {
      const response = await apiService.get(`/main-categories`, {
        businessId,
      });
      if (response.data?.data) {
        setCategory(response.data?.data);
      }
    } catch (error) {
      console.error("Error fetching main categories:", error);
    }
  }, []);

  const showDrawer = (record = null) => {
    setCurrentRecord(record);
    setStatus(record?.status ?? 1); // 1 or 2
    setIsAvailable(record?.isAvailable ?? 1);
    setRemoveImage(false);
    // Only fetch categories if not already loaded
    if (category.length === 0) {
      fetchCategories(user?.businessId);
    }
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

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
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
      formData.append('categoryId', values.categoryId);
      formData.append('businessId', user.businessId);
      formData.append('code', business.code);
      if (imageFile?.originFileObj) {
        formData.append('image', imageFile.originFileObj);
      }
      if (removeImage) {
        formData.append('removeImage', '1');
      }

      // Check if it's update or create
      if (currentRecord?.id) {
        formData.append('_method', 'PUT'); // Laravel expects PUT via POST if using method spoofing
        await apiService.post(`/sub-categories/${currentRecord.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        notificationApi.success({
          message: "Updated",
          description: "Sub-category updated successfully!",
        });
      } else {
        await apiService.post(`/sub-categories`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        notificationApi.success({
          message: "Created",
          description: "Sub-category created successfully!",
        });
      }

      fetchSubCategories(user.businessId);
      handleDrawerCancel();
    } catch (error) {
      notificationApi.error({
        message: "Save Failed",
        description: extractErrorMessages(error, 'Unable to save sub-category'),
      });
    }
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
        originFileObj: file, // ✅ needed for FormData
        url: reader.result,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    return false;
  };


  const handleStatus = async (checked, record) => {
    try {
      const status = checked ? 1 : 2;
      await apiService.put(`/sub-categories/${record.id}`, { status, businessId: user.businessId });

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
        description: extractErrorMessages(error, 'Failed to update category status'),
      });
    }
  };

  const handleAvailablity = async (checked, record) => {
    try {
      const isAvailable = checked ? 1 : 2;
      await apiService.put(`/sub-categories/${record.id}`, { isAvailable, businessId: user.businessId });

      setFilteredData((prevState) =>
        prevState.map((item) => (item.id === record.id ? { ...item, isAvailable } : item))
      );

      notificationApi.success({
        message: "Availability Updated",
        description: `Category "${record.name}" is ${checked ? "now available" : "changed to unavailable"}.`,

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

  const handleRemoveImage = () => {
    setImageFile(null);
    setRemoveImage(true);
  };

  const handleDrawerCancel = () => {
    setIsDrawerVisible(false);
    setCurrentRecord(null);
    setRemoveImage(false);
    form.resetFields();
  };

  const handleDelete = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };


  const confirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      await apiService.delete(`/sub-categories/${recordToDelete.id}`);
      notificationApi.success({
        message: "Deletion",
        description: "Category deleted successfully!",

      });
      fetchSubCategories(user.businessId);
    } catch (error) {
      notificationApi.error({
        message: "Failed to delete",
        description: extractErrorMessages(error, 'Failed to delete category. Please try again.'),
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
      <Title level={2}>Sub Category List</Title>
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
          Add Sub Category
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : filteredData.length === 0 ? (
        <Empty description="No subcategories found" style={{ padding: "60px 0" }} />
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
                      height: "auto",
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
                      fallback={`${apiService.apiUrl}/images/no-image.jpg`}
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
                      <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                        <strong>Category:</strong> {record.category?.name || "N/A"}
                      </div>
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
        title={currentRecord ? "Edit Sub Category" : "Add Sub Category"}
        open={isDrawerVisible}
        onClose={handleDrawerCancel}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            id="name"
            name="name"
            label="Sub Category Name"
            rules={[
              { required: true, message: "Please enter the category name" },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            id="categoryId"
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a Category" }]}
          >
            <Select placeholder="Select Category">
              {category &&
                category.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          {/* <Form.Item id="description" name="description" label="Description">
            <Input.TextArea placeholder="Enter description" />
          </Form.Item> */}
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


          <Form.Item name="image" label="Category Image">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Image
                  width={150}
                  src={imageFile?.url || checkImageNull(null)}
                  alt="Category Image"
                />
              </div>
              <Space>
                <Upload
                  accept="image/*"
                  beforeUpload={() => false}
                  onChange={handleImageUpload}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>
                    {imageFile?.url ? 'Change Image' : 'Upload Image'}
                  </Button>
                </Upload>
                {imageFile?.url && (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </Button>
                )}
              </Space>
            </Space>
          </Form.Item>


          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "40%", margin: '5%' }} // Full width
            >
              Save
            </Button>

            <Button
              onClick={handleDrawerCancel}
              style={{ width: "40%" }} // Full width
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Drawer>


      <Modal
        open={isDeleteModalOpen}
        title="Are you sure you want to delete this category?"
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Yes"
        cancelText="No"
        okType="danger"
      >
        <p>This action cannot be undone.</p>
      </Modal>

    </>
  );
};

export default SubCategory;
