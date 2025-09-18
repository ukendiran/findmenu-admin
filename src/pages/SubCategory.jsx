import { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Space,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  notification,
  Image,
  Switch,
  Modal,
  App,
  Upload,
} from "antd";


import { useSelector } from "react-redux";
import apiService from "../services/apiService";
import { extractErrorMessages } from "../utils/errorHelper";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";


const { Title } = Typography;
const { Option } = Select;

const SubCategory = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
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
  const [status, setStatus] = useState(1);
  const [isAvailable, setIsAvailable] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    if (user?.businessId) {
      fetchSubCategories(user.businessId);
    }
  }, [user?.businessId]);



  const fetchCategories = async (businessId) => {
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
  };

  const fetchSubCategories = async (businessId) => {
    try {
      setLoading(true)
      const response = await apiService.get(`/sub-categories-with-category`, {
        businessId,
      });
      if (response.data?.data) {
        const dataWithKeys = response.data.data.map((item, index) => ({
          ...item,
          key: item.id || index, // Use `id` if available, otherwise fallback to index
        }));
        setData(dataWithKeys);
        setFilteredData(dataWithKeys);
      }
    } catch (error) {
      console.error("Error fetching sub categories:", error);
    } finally {
      setLoading(false);

    }
  };
  const showDrawer = (record = null) => {
    setCurrentRecord(record);
    setStatus(record?.status ?? 1); // 1 or 2
    setIsAvailable(record?.isAvailable ?? 1);
    fetchCategories(user?.businessId)
    if (record) {
      form.setFieldsValue(record);
      setImageFile({
        url: `${record.image}`,
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

  const columns = [
    {
      title: "Sub Category",
      dataIndex: "name",
      key: "name",
      width: "200px",
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category.name",
      sorter: (a, b) => (a.category?.name || "").localeCompare(b.category?.name || ""),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "200",
      render: (image) => (
        <Image
          src={`${apiService.apiUrl}/${image}`}
          alt="item"
          style={{
            width: 150,
            height: 100,
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={status === 1} onChange={(checked) => handleStatus(checked, record)} />
      ),
    },
    {
      title: "Availability",
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (isAvailable, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={isAvailable === 1} onChange={(checked) => handleAvailablity(checked, record)} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => showDrawer(record)}>
            Edit
          </Button>
          <Button
            size="small"
            type="primary"
            danger
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

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

  const handleDrawerCancel = () => {
    setIsDrawerVisible(false);
    setCurrentRecord(null);
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
    <App>
      {contextHolder}
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

      <Table
        columns={columns}
        dataSource={filteredData}
        scroll={{ x: "max-content", y: "60vh" }} // Horizontal and vertical scroll
        pagination={false} // Display all items on one page
        loading={loading}
      />

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
            <Space direction="horizontal" align="start">
              {imageFile?.url && (
                <Image
                  width={150}
                  src={imageFile.url}
                  alt="Category Image"
                />
              )}
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

    </App>
  );
};

export default SubCategory;
