import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Col,
  Form,
  Row,
  Spin,
  Input,
  Upload,
  Image,
  notification,
  App,
  Space,
  Select
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import apiService from "../services/apiService";

const { TextArea } = Input;

export default function BusinessDetails({ businessId }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  const getFullUrl = (file) => {
    if (!file) return null;
    if (file.url?.startsWith("data:")) return file.url;
    if (file.name?.startsWith("http") || file.url?.startsWith("http")) {
      return file.name || file.url;
    }
    return `${apiService.apiUrl}/${file.name || file.url}`;
  };

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const result = await apiService.get(`/business/${businessId}`);
        const data = result.data.data;
        setBusinessData(data);
        form.setFieldsValue(data);
        setImageFile({ name: data.image, url: data.image });
        setBannerImageFile({ name: data.bannerImage, url: data.bannerImage });
      } catch (e) {
        console.error("Error fetching business data:", e);
        showNotification('error', 'Error', 'Failed to fetch business data');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  // Notification helper to avoid calling in render
  const showNotification = (type, message, description) => {
    api[type]({ message, description });
  };

  const handleImageUpload = (info, setter) => {
    const file = info.file;
    const isImage = file.type?.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage || !isLt2M) {
      showNotification(
        'error',
        'Upload Error',
        isImage ? "Image must be smaller than 2MB!" : "Only image files are allowed"
      );
      return false;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setter({
        file,
        originFileObj: file,
        url: reader.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append form values
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, val);
        }
      });

      // Append metadata
      formData.append("id", businessData.id);
      formData.append("_method", "PUT");

      // Append images if updated
      if (imageFile?.originFileObj) {
        formData.append("image", imageFile.originFileObj);
      }
      if (bannerImageFile?.originFileObj) {
        formData.append("bannerImage", bannerImageFile.originFileObj);
      }

      const response = await apiService.post(`/business/${businessData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        showNotification('success', 'Updated', 'Business updated successfully!');
        // Update local state with new data
        const updatedData = { ...businessData, ...values };
        if (response.data.data?.image) updatedData.image = response.data.data.image;
        if (response.data.data?.bannerImage) updatedData.bannerImage = response.data.data.bannerImage;
        setBusinessData(updatedData);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (e) {
      console.error("Error updating business:", e);
      showNotification('error', 'Error', e.message || 'Failed to update business');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <App>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          {/* Left Column - Form Fields */}
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item label="Business Code" name="code">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Business Name"
              name="name"
              rules={[{ required: true, message: "Business name is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
            </Form.Item>

            <Form.Item
              label="Contact Number"
              name="mobile"
              rules={[{ required: true, message: "Contact number is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Currency"
              name="currency"
              rules={[{ required: true, message: "Please select a currency" }]}
            >
              <Select placeholder="Select currency">
                <Select.Option value="rupee">Rupee (₹)</Select.Option>
                <Select.Option value="dollar">Dollar ($)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Middle Column - Logo */}
          <Col xs={24} sm={24} md={12} lg={12} style={{ textAlign: "center" }}>
            <Form.Item label="Logo Image">
              <Space direction="vertical" align="center">
                {imageFile?.url && (
                  <Image
                    width={150}
                    src={getFullUrl(imageFile)}
                    style={{ maxHeight: 150, objectFit: 'contain' }}
                    preview={false}
                  />
                )}
                <Upload
                  accept="image/*"
                  beforeUpload={() => false}
                  onChange={(info) => handleImageUpload(info, setImageFile)}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Upload Logo</Button>
                </Upload>
              </Space>
            </Form.Item>
            <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
              Recommended: JPEG/PNG, 200×200px
            </div>


            {/* Right Column - Banner */}

            <Form.Item label="Banner Image">
              <Space direction="vertical" align="center">
                {bannerImageFile?.url && (
                  <Image
                    width={500}
                    src={getFullUrl(bannerImageFile)}
                    style={{ maxHeight: 400, objectFit: 'contain' }}
                    preview={false}
                  />
                )}
                <Upload
                  accept="image/*"
                  beforeUpload={() => false}
                  onChange={(info) => handleImageUpload(info, setBannerImageFile)}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Upload Banner</Button>
                </Upload>
              </Space>
            </Form.Item>
            <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
              Recommended: JPEG/PNG, 500×300px
            </div>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row justify="center" style={{ marginTop: 24 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
            >
              Save Changes
            </Button>
          </Col>
        </Row>
      </Form>
    </App>
  );
}

BusinessDetails.propTypes = {
  businessId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};