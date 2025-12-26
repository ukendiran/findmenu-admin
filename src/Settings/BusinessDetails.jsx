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
import { extractErrorMessages } from "../utils/errorHelper";
import { renderCustomField, setCustomFieldsInForm, prepareCustomFieldsForSubmit } from "../utils/customFieldsHelper.jsx";

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
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);
  const [businessType, setBusinessType] = useState(null);
  const [selectedBusinessTypeDetails, setSelectedBusinessTypeDetails] = useState(null);
  const { notification: notificationApi } = App.useApp();

  const getFullUrl = (file) => {
    if (!file) return null;
    if (file.url?.startsWith("data:")) return file.url;
    if (file.name?.startsWith("http") || file.url?.startsWith("http")) {
      return file.name || file.url;
    }
    return `${apiService.apiUrl}/${file.name || file.url}`;
  };

  const fetchBusinessTypes = useCallback(async () => {
    try {
      setLoadingBusinessTypes(true);
      const response = await apiService.get(`/business-types`, { status: 1 });
      if (response.data?.success && response.data?.data) {
        setBusinessTypes(response.data.data);
      }
    } catch (error) {
      // Ignore if request was canceled
      if (error.code === 'ERR_CANCELED' || error.message === 'canceled') {
        return;
      }
      // Only show user-friendly message, no system error details
      notificationApi.error({
        message: "Load Error",
        description: "Unable to load business types. Please refresh the page.",
      });
    } finally {
      setLoadingBusinessTypes(false);
    }
  }, [notificationApi]);

  const fetchBusinessTypeDetails = useCallback(async (businessTypeId) => {
    if (!businessTypeId) {
      setSelectedBusinessTypeDetails(null);
      return;
    }

    try {
      const response = await apiService.get(`/business-types/${businessTypeId}`);
      if (response.data?.success && response.data?.data) {
        setSelectedBusinessTypeDetails(response.data.data);
      }
    } catch (error) {
      // Ignore if request was canceled
      if (error.code === 'ERR_CANCELED' || error.message === 'canceled') {
        return;
      }
      console.error("Error fetching business type details:", error);
    }
  }, []);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const result = await apiService.get(`/business/${businessId}`);
        const data = result.data.data;
        setBusinessData(data);
        setBusinessType(data.business_type_id);

        setImageFile(data.image ? { name: data.image, url: data.image } : null);
        setBannerImageFile(data.bannerImage ? { name: data.bannerImage, url: data.bannerImage } : null);
        setRemoveLogo(false);
        setRemoveBanner(false);
      } catch (e) {
        // Ignore if request was canceled
        if (e.code === 'ERR_CANCELED' || e.message === 'canceled') {
          return;
        }
        console.error("Error fetching business data:", e);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusinessData();
      fetchBusinessTypes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  // Fetch business type details when business type changes
  useEffect(() => {
    if (businessType) {
      fetchBusinessTypeDetails(businessType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessType]);

  // Set form values after businessData is loaded and Form is mounted
  useEffect(() => {
    if (businessData && !loading) {
      form.setFieldsValue({
        ...businessData,
        group: businessData.group?.name || 'N/A',
        business_type_id: businessData.business_type_id || ''
      });
      
      // Set custom fields values
      if (businessData.custom_fields) {
        setCustomFieldsInForm(form, businessData.custom_fields);
      }
    }
  }, [businessData, loading, form]);

  const handleBusinessTypeChange = (value) => {
    setBusinessType(value);
    // Clear custom fields when business type changes
    form.setFieldsValue({ custom_fields: {} });
    // Clear license number when business type changes from restaurant
    const selectedType = businessTypes.find(type => type.id === value);
    if (selectedType?.name !== "restaurant") {
      form.setFieldValue("license_no", "");
    }
    // Fetch new business type details
    if (value) {
      fetchBusinessTypeDetails(value);
    } else {
      setSelectedBusinessTypeDetails(null);
    }
  };

  const showNotification = useCallback((type, message, description) => {
    notificationApi[type]({ message, description });
  }, [notificationApi]);

  const handleImageUpload = (info, setter) => {
    const file = info.file.originFileObj || info.file;
    
    // Ensure we have a File object
    if (!(file instanceof File)) {
      setTimeout(() => {
        notificationApi.error({
          message: 'Upload Error',
          description: "Invalid file object",
        });
      }, 0);
      return false;
    }

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
        // Skip custom_fields as we'll handle it separately
        if (key === 'custom_fields') return;
        
        if (val !== undefined && val !== null) {
          formData.append(key, val);
        }
      });

      // Handle custom fields
      if (values.custom_fields) {
        const customFieldsJson = prepareCustomFieldsForSubmit(values.custom_fields);
        if (customFieldsJson) {
          formData.append("custom_fields", customFieldsJson);
        }
      }

      formData.append("id", businessData.id);
      formData.append("_method", "PUT");

      if (imageFile?.originFileObj && imageFile.originFileObj instanceof File) {
        formData.append("image", imageFile.originFileObj, imageFile.originFileObj.name);
      }
      if (bannerImageFile?.originFileObj && bannerImageFile.originFileObj instanceof File) {
        formData.append("bannerImage", bannerImageFile.originFileObj, bannerImageFile.originFileObj.name);
      }
      if (removeLogo) {
        formData.append("removeLogo", "1");
      }
      if (removeBanner) {
        formData.append("removeBanner", "1");
      }

      const response = await apiService.post(`/business/${businessData.id}`, formData);

      if (response.data.success) {
        showNotification('success', 'Success', 'Business details updated successfully!');
        const updatedData = { ...businessData, ...values };
        if (response.data.data?.image) updatedData.image = response.data.data.image;
        if (response.data.data?.bannerImage) updatedData.bannerImage = response.data.data.bannerImage;
        setBusinessData(updatedData);
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
                      <Text strong>
                        Business Type
                        <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>
                      </Text>
                    }
                    name="business_type_id"
                    rules={[{ required: true, message: "Please select a business type" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Select business type"
                      onChange={handleBusinessTypeChange}
                      loading={loadingBusinessTypes}
                      suffixIcon={<ShopOutlined />}
                    >
                      {businessTypes.map((type) => (
                        <Select.Option key={type.id} value={type.id}>
                          {type.name}
                        </Select.Option>
                      ))}
                    </Select>
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

                {businessTypes.find(type => type.id === businessType)?.name === 'restaurant' && (
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={<Text strong>FSSAI License No</Text>}
                      name="license_no"
                    >
                      <Input
                        size="large"
                        placeholder="Enter FSSAI license number"
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Custom Fields Section */}
        {selectedBusinessTypeDetails?.fields && selectedBusinessTypeDetails.fields.length > 0 && (
          <Row gutter={[32, 32]} style={{ marginTop: 8 }}>
            <Col xs={24}>
              <Card
                title={
                  <span>
                    <ShopOutlined style={{ marginRight: 8 }} />
                    Additional Information
                  </span>
                }
                bordered={false}
                className="custom-card"
              >
                <Row gutter={[16, 16]}>
                  {selectedBusinessTypeDetails.fields.map((field) => (
                    <Col xs={24} sm={12} key={field.id}>
                      {renderCustomField(field)}
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        )}

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
                      <div>Recommended: JPEG, PNG, WebP, or AVIF</div>
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
                      <div>Recommended: JPEG, PNG, WebP, or AVIF</div>
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