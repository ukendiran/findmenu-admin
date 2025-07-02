import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Col, Form, Row, Spin, Input, Upload, Image, notification, App, Select, Space } from "antd";
const { TextArea } = Input;
import { UploadOutlined } from '@ant-design/icons';
import apiService from "../services/apiService";

export default function BusinessDetails({ businessId }) {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    getBusinessData();
  }, []);

  useEffect(() => {
    if (error) {
      notificationApi.error({ message: "Error", description: error, placement: "bottomRight" });
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      notificationApi.success({ message: "Updated", description: successMessage, placement: "bottomRight" });
      setSuccessMessage(null);
    }
  }, [successMessage]);


  const getBusinessData = async () => {
    try {
      const result = await apiService.get(`/business/${businessId}`);
      const response = result.data;
      if (response.data) {
        const data = response.data;
        setBusinessData(data);
        form.setFieldsValue(data);
        setImageFile({ url: data.image, name: data.image });
        setBannerImageFile({ url: data.bannerImage, name: data.bannerImage });
        setLoading(false);
      }
    } catch (error) {
      setError("Error on data fetch");
      console.error(error);
      setLoading(false);
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

  const handleBannerImageUpload = (info) => {
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
      setBannerImageFile({
        file: file,
        originFileObj: file, // ✅ needed for FormData
        url: reader.result,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    return false;
  };


  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      formData.append('id', businessData.id);
      formData.append('_method', 'PUT');
      if (imageFile?.originFileObj) {
        formData.append('image', imageFile.originFileObj);
      }
      if (bannerImageFile?.originFileObj) {
        formData.append('bannerImage', bannerImageFile.originFileObj);
      }


      await apiService.post(`business/${businessData.id}`, formData).then((response) => {
        if (response.data.success) {
          setSuccessMessage("Business details updated successfully!");
        } else {
          setError("Error on Update");
        }
      });

    } catch (error) {
      setError("Error on Update");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px 0" }}><Spin size="large" /></div>;
  }

  return (
    <App>
      {contextHolder}
      <Form layout="vertical" onFinish={handleSubmit} form={form}>
        <Row gutter={[16, 16]} justify="start" align="middle">
          {/* Left Column */}
          <Col xs={24} sm={24} md={8} lg={8}>
            <Form.Item
              label="Business Code"
              name="code"
            >
              <Input disabled placeholder="Enter business name" />
            </Form.Item>
            <Form.Item
              label="Business Name"
              name="name"
              rules={[{ required: true, message: "Business name is required" }]}
            >
              <Input placeholder="Enter business name" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <TextArea placeholder="Enter address" autoSize={{ minRows: 2, maxRows: 5 }} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea placeholder="Enter description" autoSize={{ minRows: 2, maxRows: 5 }} />
            </Form.Item>

            <Form.Item
              label="Contact Number"
              name="mobile"
              rules={[{ required: true, message: "Contact number is required" }]}
            >
              <Input placeholder="Enter contact number" />
            </Form.Item>

            <Form.Item
              name="currency"
              label="currency"
              rules={[{ required: true, message: "Please select a currency" }]}
            >
              <Select placeholder="Select currency">
                <Select.Option value={'rupee'}>Rupee (₹)</Select.Option>
                <Select.Option value={'dollar'}>Dollar ($)</Select.Option>
              </Select>
            </Form.Item>

          </Col>
          {/* Logo Section */}
          <Col xs={24} sm={24} md={4} lg={4} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>

            <Form.Item name="image" label="Logo Image">
              <Space direction="vertical" align="start">
                {imageFile?.url && (
                  <Image
                    width={150}
                    src={imageFile.name ? `${apiService.apiUrl}${imageFile.name}` : imageFile?.url}
                    alt="Logo Image"
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
            <small style={{ marginTop: 10 }}>Recommended JPEG/PNG, size 200x200</small>
          </Col>

          {/* Right Column for Images */}
          <Col xs={24} sm={24} md={12} lg={12} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <Form.Item name="bannerImageFile" label="Banner Image">
              <Space direction="vertical" align="start">
                {bannerImageFile?.url && (
                  <Image
                    width={250}
                    src={bannerImageFile.name ? `${apiService.apiUrl}${bannerImageFile.name}` : bannerImageFile?.url}
                    alt="Banner Image"
                  />
                )}
                <Upload
                  accept="image/*"
                  beforeUpload={() => false}
                  onChange={handleBannerImageUpload}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Space>
            </Form.Item>
            <small style={{ marginTop: 10 }}>Recommended JPEG/PNG, size 500x300</small>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row justify="center" style={{ marginTop: "20px" }}>
          <Col xs={24} sm={12} md={6}>
            <Button type="primary" htmlType="submit" block>Save Changes</Button>
          </Col>
        </Row>
      </Form>
    </App>
  );
}

BusinessDetails.propTypes = {
  businessId: PropTypes.any,
};
