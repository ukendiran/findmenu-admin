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
  Upload,
  App,
} from "antd";
import { useSelector } from "react-redux";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import apiService from "../services/apiService";

const { Title } = Typography;
const { Option } = Select;


const MainCategory = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const token = useSelector((state) => state.auth.token);
  const user = token.data
  const [data, setData] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(user)
    if (user?.restaurantId) {
      fetchCategories(user.restaurantId);
    }
  }, [user]);

  const fetchCategories = async (restaurantId) => {
    try {
      setLoading(true);
      const response = await apiService.post(`/maincategory/list`, { restaurantId });
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
        description: error.response?.data?.message || "Failed to load categories",
      });
    } finally {
      setLoading(false);

    }
  };

  const showDrawer = (record = null) => {
    setCurrentRecord(record);
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
      console.log("user", user)
      const formData = new FormData();
      formData.append('name', values.name);
      // formData.append('description', values.description);
      formData.append('status', values.status);
      formData.append('restaurantId', user.restaurantId);
      formData.append('restaurantCode', user.restaurantCode);

      if (imageFile?.file) {
        formData.append('image', imageFile.file);
      }

      if (currentRecord) {
        formData.append('id', currentRecord.id);
        await apiService.post(`/maincategory/update`, formData);
        notificationApi.success({ message: "Updated", description: "Category updated successfully!" });
      } else {
        await apiService.post(`/maincategory/create`, formData);
        notificationApi.success({ message: "Created", description: "Category created successfully!" });
      }

      fetchCategories(user.restaurantId);
      handleDrawerCancel();
    } catch (error) {
      notificationApi.error({
        message: "Save Failed",
        description: error.response?.data?.message || "Unable to save category",
      });
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete Category",
      content: "Are you sure you want to delete this category?",
      onOk: async () => {
        try {
          await apiService.delete(`/maincategory/${record.id}`);
          notificationApi.success({ message: "Deleted", description: "Category deleted successfully!" });
          fetchCategories(user.restaurantId);
        } catch (error) {
          notificationApi.error({
            message: "Delete Failed",
            description: error.response?.data?.message || "Unable to delete category",
          });
        }
      },
    });
  };


  const handleStatus = async (checked, record) => {
    try {
      const status = checked ? 1 : 2;
      await apiService.put(`/maincategory/update/${record.id}`, { status });

      setFilteredData((prevState) =>
        prevState.map((item) => (item.id === record.id ? { ...item, status } : item))
      );

      notificationApi.success({
        message: "Status Updated",
        description: `Category "${record.name}" has been ${checked ? "enabled" : "disabled"}.`,
        placement: "bottomRight",
      });
    } catch (error) {
      notificationApi.error({
        message: "Update Failed",
        description: error.response?.data?.message || "Failed to update category status",
        placement: "bottomRight",
      });
    }
  };

  const handleAvailablity = async (checked, record) => {
    try {
      const isAvailable = checked ? 1 : 2;
      await apiService.put(`/maincategory/update/${record.id}`, { isAvailable });

      setFilteredData((prevState) =>
        prevState.map((item) => (item.id === record.id ? { ...item, isAvailable } : item))
      );

      notificationApi.success({
        message: "Availability Updated",
        description: `Category "${record.name}" is now ${checked ? "available" : "unavailable"}.`,
        placement: "bottomRight",
      });
    } catch {
      notificationApi.error({
        message: "Update Failed",
        description: "Failed to update category availability.",
        placement: "bottomRight",
      });
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    // {
    //   title: "Image",
    //   dataIndex: "image",
    //   key: "image",
    //   width: "200",
    //   render: (image) => (
    //     <Image
    //       src={image}
    //       alt="item"
    //       style={{
    //         width: 150,
    //         height: 100,
    //         objectFit: "cover",
    //         borderRadius: "4px",
    //       }}
    //     />
    //   ),
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch checked={status === 1} onChange={(checked) => handleStatus(checked, record)} />
      ),
    },
    {
      title: "Availability",
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (isAvailable, record) => (
        <Switch checked={isAvailable === 1} onChange={(checked) => handleAvailablity(checked, record)} />
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

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <App>
      {contextHolder}
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

      <Table
        columns={columns}
        dataSource={filteredData}
        scroll={{ x: "max-content", y: "60vh" }}
        loading={loading}
      />

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
          {/* <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter description" />
          </Form.Item> */}
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select status">
              <Option value={1}>Enabled</Option>
              <Option value={2}>Disabled</Option>
            </Select>
          </Form.Item>
          <Form.Item name="image" label="Category Image" style={{ display: 'none' }}>
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
    </App>
  );
};

export default MainCategory;