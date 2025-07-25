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
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;


const Items = () => {
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const user = useSelector((state) => state.auth.user);
  const business = useSelector((state) => state.auth.business);
  const [data, setData] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(1);
  const [isAvailable, setIsAvailable] = useState(1);

  const columns = [
    {
      title: "Item Name",
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
      title: "Sub Category",
      dataIndex: ["sub_category", "name"],
      key: "sub_category.name",
      sorter: (a, b) => (a.sub_category?.name || "").localeCompare(b.sub_category?.name || ""),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "200px",
      sorter: (a, b) => a.price.localeCompare(b.price),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "200",
      render: (image) => (
        <Image
          src={`${apiService.apiUrl}${image}`}
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

  useEffect(() => {
    if (user?.businessId) {
      fetchItems(user.businessId);
    }
  }, [user, business]);




  const fetchCategories = async (businessId) => {
    try {
      const response = await apiService.get(`/main-categories`, {
        businessId,
      });
      if (response.data?.data) {
        setCategory(response.data?.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async (businessId, categoryId) => {
    try {
      const response = await apiService.get(`/sub-categories`, {
        businessId,
        categoryId,
      }
      );
      if (response.data?.data) {
        setSubCategory(response.data?.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchItems = async (businessId) => {
    try {
      setLoading(true)
      const response = await apiService.get(`/items-with-category`, {
        businessId,
      });
      console.log("response", response.data);
      if (response.data?.data) {
        const dataWithKeys = response.data.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));


        setData(dataWithKeys);
        setFilteredData(dataWithKeys);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false)
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

  const showDrawer = (record = null) => {
    console.log("showDrawer", record);
    fetchCategories(user.businessId);
    setStatus(record?.status ?? 1); // 1 or 2
    setIsAvailable(record?.isAvailable ?? 1);
    setCurrentRecord(record);
    if (record) {
      fetchSubCategories(user.businessId, record.categoryId);
      form.setFieldsValue(record);
      setImageFile({
        url: record.image,
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
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
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
      formData.append('price', values.price);
      formData.append('categoryId', values.categoryId);
      formData.append('subCategoryId', values.subCategoryId);
      formData.append('businessId', user.businessId);
      formData.append('code', business.code);
      if (imageFile?.originFileObj) {
        formData.append("image", imageFile.originFileObj);
      }


      // Check if it's update or create
      if (currentRecord?.id) {
        formData.append('_method', 'PUT'); // Laravel expects PUT via POST if using method spoofing
        await apiService.post(`/items/${currentRecord.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        notificationApi.success({
          message: "Updated",
          description: "Items updated successfully!",
        });
      } else {
        await apiService.post(`/items`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        notificationApi.success({
          message: "Created",
          description: "Items created successfully!",
        });
      }

      fetchItems(user.businessId);
      handleDrawerCancel();
    } catch (error) {
      console.error("Error saving item:", error);
      notificationApi.error({
        message: "Failed to save",
        description: "Failed to save item. Please try again.",
      });
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await apiService.delete(`/items/${record.id}`);
          notificationApi.success({
            message: "Deletion",
            description: "Item deleted successfully!",
          });
          fetchItems(user.businessId);
        } catch (error) {
          console.error("Error deleting item:", error);
          notificationApi.error({
            message: "Failed to delete",
            description: "Failed to delete item. Please try again.",
          });
        }
      },
    });
  };

  const handleCategoryChange = (value) => {
    setSubCategory([]);
    fetchSubCategories(user.businessId, value);
  };

  const handleStatus = async (checked, record) => {
    try {
      const status = checked ? 1 : 2;
      await apiService.put(`/items/update/${record.id}`, { status });

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
      await apiService.put(`/items/update/${record.id}`, { isAvailable });

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
      <Title level={2}>Item List</Title>
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
          Add Item
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        scroll={{ x: "max-content", y: "60vh" }}
        pagination={false}
        loading={loading}
      />

      <Drawer
        title={currentRecord ? "Edit Item" : "Add Item"}
        open={isDrawerVisible}
        onClose={handleDrawerCancel}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            id="name"
            name="name"
            label="Item Name"
            rules={[{ required: true, message: "Please enter the item name" }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>

          <Form.Item
            id="categoryId"
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a Category" }]}
          >
            <Select
              placeholder="Select Category"
              onChange={handleCategoryChange}
            >
              {category &&
                category.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            id="subCategoryId"
            name="subCategoryId"
            label="Sub Category"
            rules={[
              { required: true, message: "Please select a Sub Category" },
            ]}
          >
            <Select placeholder="Select Sub Category">
              {subCategory &&
                subCategory.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item id="price" name="price" label="Price">
            <Input placeholder="Enter price" />
          </Form.Item>

          <Form.Item id="description" name="description" label="Description">
            <Input.TextArea placeholder="Enter description" />
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

          <Form.Item name="image" label="Item Image">
            <Space direction="horizontal">
              {imageFile?.url && <Image src={imageFile.url} width={150} />}
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
              style={{ width: "40%", margin: "5%" }} // Full width
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
    </App>
  );
};

export default Items;
