import { useEffect, useState, useCallback } from "react";
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
  Select,
  Card,
  Typography,
  Avatar,
  Tag
} from "antd";
import {
  UploadOutlined,
  CameraOutlined,
  PictureOutlined,
  ShopOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import apiService from "../services/apiService";

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function BusinessDetails({ businessId }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [businessData, setBusinessData] = useState(null);
  const { notification: notificationApi } = App.useApp();

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

        setTimeout(() => {
          form.setFieldsValue({
            ...data,
            group: data.group?.name || 'N/A'
          });
        }, 0);

        setImageFile(data.image ? { name: data.image, url: data.image } : null);
        setBannerImageFile(data.bannerImage ? { name: data.bannerImage, url: data.bannerImage } : null);
        setRemoveLogo(false);
        setRemoveBanner(false);
      } catch (e) {
        console.error("Error fetching business data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId, form]);

  const showNotification = useCallback((type, message, description) => {
    notificationApi[type]({ message, description });
  }, [notificationApi]);

  const handleImageUpload = (info, setter) => {
    const file = info.file;
    const isImage = file.type?.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage || !isLt2M) {
      setTimeout(() => {
        notificationApi.error({
          message: 'Upload Error',
          description: isImage
            ? "Image must be smaller than 2MB!"
            : "Only image files are allowed",
        });
      }, 0);
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

  const handleRemoveLogo = () => {
    setImageFile(null);
    setRemoveLogo(true);
  };

  const handleRemoveBanner = () => {
    setBannerImageFile(null);
    setRemoveBanner(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, val);
        }
      });

      formData.append("id", businessData.id);
      formData.append("_method", "PUT");

      if (imageFile?.originFileObj) {
        formData.append("image", imageFile.originFileObj);
      }
      if (bannerImageFile?.originFileObj) {
        formData.append("bannerImage", bannerImageFile.originFileObj);
      }
      if (removeLogo) {
        formData.append("removeLogo", "1");
      }
      if (removeBanner) {
        formData.append("removeBanner", "1");
      }

      const response = await apiService.post(`/business/${businessData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        showNotification('success', 'Success', 'Business details updated successfully!');
        const updatedData = { ...businessData, ...values };
        if (response.data.data?.image) updatedData.image = response.data.data.image;
        if (response.data.data?.bannerImage) updatedData.bannerImage = response.data.data.bannerImage;
        setBusinessData(updatedData);

        // Defer notification
        setTimeout(() => {
          notificationApi.success({
            message: "Updated",
            description: "Business updated successfully!",
          });
        }, 0);
      } else {
        setTimeout(() => {
          notificationApi.error({
            message: "Update Failed",
            description: "Unable to update",
          });
        }, 0);
      }

    } catch (error) {
      setTimeout(() => {
        notificationApi.error({
          message: "Save Failed",
          description: extractErrorMessages(error, 'Failed to update business'),
        });
      }, 0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Loading business details...</Text>
        </div>
      </div>
    );
  }

  return (
    <>

      {/* Header Section */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, color: '#1890ff' }}>
          <ShopOutlined /> Business Profile
        </Title>
        <Text type="secondary">
          Manage your business information, branding, and contact details
        </Text>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[32, 32]}>
          {/* Left Column - Basic Information */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <ShopOutlined style={{ marginRight: 8 }} />
                  Basic Information
                </span>
              }
              style={{ height: '100%' }}
              bordered={false}
              className="custom-card"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={
                      <Text strong>Business Code</Text>
                    }
                    name="code"
                  >
                    <Input
                      disabled
                      size="large"
                      prefix={<Text type="secondary">#</Text>}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={
                      <Text strong>Business Type</Text>
                    }
                    name="businessType"
                  >
                    <Input
                      disabled
                      size="large"
                      prefix={<ShopOutlined style={{ color: '#999' }} />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label={
                      <Text strong>Business Name</Text>
                    }
                    name="name"
                    rules={[{ required: true, message: "Business name is required" }]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter business name"
                      prefix={<ShopOutlined style={{ color: '#999' }} />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label={
                      <Text strong>Description</Text>
                    }
                    name="description"
                    rules={[{ required: true, message: "Description is required" }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Describe your business..."
                      style={{ resize: 'none' }}
                      showCount
                      maxLength={1000}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column - Contact & Media */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  Contact & Media
                </span>
              }
              style={{ height: '100%' }}
              bordered={false}
              className="custom-card"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={
                      <Text strong>
                        <MailOutlined style={{ marginRight: 8 }} />
                        Email
                      </Text>
                    }
                    name="email"
                  >
                    <Input
                      disabled
                      size="large"
                      prefix={<MailOutlined style={{ color: '#999' }} />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={
                      <Text strong>Contact Number</Text>
                    }
                    name="mobile"
                    rules={[{ required: true, message: "Contact number is required" }]}
                  >
                    <Input
                      size="large"
                      placeholder="+1 234 567 8900"
                      prefix={<PhoneOutlined style={{ color: '#999' }} />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label={
                      <Text strong>
                        <EnvironmentOutlined style={{ marginRight: 8 }} />
                        Address
                      </Text>
                    }
                    name="address"
                    rules={[{ required: true, message: "Address is required" }]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Enter business address..."
                      style={{ resize: 'none' }}
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={
                      <Text strong>
                        <DollarOutlined style={{ marginRight: 8 }} />
                        Currency
                      </Text>
                    }
                    name="currency"
                    rules={[{ required: true, message: "Please select a currency" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Select currency"
                      suffixIcon={<DollarOutlined />}
                    >
                      <Select.Option value="rupee">
                        <Tag color="green">₹ Rupee</Tag>
                      </Select.Option>
                      <Select.Option value="dollar">
                        <Tag color="blue">$ Dollar</Tag>
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                {businessData.businessType === 'restaurant' && (
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={<Text strong>FSSAI License No</Text>}
                      name="license_no"
                    >
                      <Input
                        size="large"
                        placeholder="Enter license number"
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Media Section */}
        <Row gutter={[32, 32]} style={{ marginTop: 8 }}>
          {/* Logo Upload */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <CameraOutlined style={{ marginRight: 8 }} />
                  Logo Image
                </span>
              }
              bordered={false}
              className="custom-card"
            >
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {imageFile?.url ? (
                    <Avatar
                      size={120}
                      src={getFullUrl(imageFile)}
                      style={{
                        border: '3px solid #f0f0f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                  ) : (
                    <Avatar
                      size={120}
                      icon={<CameraOutlined />}
                      style={{
                        backgroundColor: '#f5f5f5',
                        border: '2px dashed #d9d9d9'
                      }}
                    />
                  )}

                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Space>
                      <Upload
                        accept="image/*"
                        beforeUpload={() => false}
                        onChange={(info) => {
                          handleImageUpload(info, setImageFile);
                          setRemoveLogo(false);
                        }}
                        showUploadList={false}
                      >
                        <Button
                          type="dashed"
                          icon={<UploadOutlined />}
                          size="large"
                        >
                          {imageFile?.url ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                      </Upload>
                      {imageFile?.url && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          size="large"
                          onClick={handleRemoveLogo}
                        >
                          Remove Logo
                        </Button>
                      )}
                    </Space>
                    <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                      <div>Recommended: JPEG, PNG, or WebP</div>
                      <div>Square ratio • Max 2MB • 200×200px</div>
                    </div>
                  </Space>
                </Space>
              </div>
            </Card>
          </Col>

          {/* Banner Upload */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <PictureOutlined style={{ marginRight: 8 }} />
                  Banner Image
                </span>
              }
              bordered={false}
              className="custom-card"
            >
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {bannerImageFile?.url ? (
                    <Image
                      width="100%"
                      style={{
                        maxHeight: 200,
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '3px solid #f0f0f0'
                      }}
                      src={getFullUrl(bannerImageFile)}
                      preview={false}
                      placeholder={
                        <div style={{
                          height: 200,
                          background: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 8
                        }}>
                          <PictureOutlined style={{ fontSize: 32, color: '#d9d9d9' }} />
                        </div>
                      }
                    />
                  ) : (
                    <div
                      style={{
                        height: 200,
                        background: '#fafafa',
                        border: '2px dashed #d9d9d9',
                        borderRadius: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <PictureOutlined style={{ fontSize: 32, color: '#bfbfbf', marginBottom: 8 }} />
                      <Text type="secondary">No banner image</Text>
                    </div>
                  )}

                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Space>
                      <Upload
                        accept="image/*"
                        beforeUpload={() => false}
                        onChange={(info) => {
                          handleImageUpload(info, setBannerImageFile);
                          setRemoveBanner(false);
                        }}
                        showUploadList={false}
                      >
                        <Button
                          type="dashed"
                          icon={<UploadOutlined />}
                          size="large"
                        >
                          {bannerImageFile?.url ? 'Change Banner' : 'Upload Banner'}
                        </Button>
                      </Upload>
                      {bannerImageFile?.url && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          size="large"
                          onClick={handleRemoveBanner}
                        >
                          Remove Banner
                        </Button>
                      )}
                    </Space>
                    <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                      <div>Recommended: JPEG, PNG, or WebP</div>
                      <div>Landscape ratio • Max 2MB • 500×300px</div>
                    </div>
                  </Space>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Submit Section */}
        <Row justify="center" style={{ marginTop: 48 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
              }}
            >
              Save Changes
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Add some custom styles */}
      <style>{`
        :global(.custom-card) {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }
        
        :global(.custom-card:hover) {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          border-color: #d6e4ff;
        }
      `}</style>
    </>
  );
}

BusinessDetails.propTypes = {
  businessId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};