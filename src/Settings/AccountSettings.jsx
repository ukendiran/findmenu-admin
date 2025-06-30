import { Button, Col, Form, notification, Row, Spin, Input, Upload, Image, App } from "antd";


import apiService from "../../services/apiService";
import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { UploadOutlined } from "@ant-design/icons";


export default function AccountSettings({ businessId, userId }) {

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);

  const [notificationApi, contextHolder] = notification.useNotification();
  useEffect(() => {
    getUserData();
  }, [businessId]);



  const getUserData = async () => {
    try {
      const result = await apiService.get(`/users/${userId}`);
      const response = result.data.data;
      if (response) {
        setUserData(response);
        setLoading(false);
        setImageFile({ url: response.image, name: response.image });

      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  const handleImageUpload = (info) => {
    const file = info.file;
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage || !isLt2M) {
      notificationApi.error({
        message: "Error",
        description: !isImage ? "Only image files are allowed" : "Image must be smaller than 2MB!",
        placement: "bottomRight",
      });
      return false;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile({ file, url: reader.result, name: file.name });
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
      formData.append('oldImage', (userData.image).replace(`${apiService.appUrl}/`, ""));
      formData.append('id', userData.id);
      // formData.append('businessCode', userData.businessCode);

      if (imageFile?.file) formData.append('profileImage', imageFile.file);

      apiService
        .put(`/users/${userData.id}`, formData)
        .then((response) => {
          if (response.data.success) {
            setLoading(false);
            notificationApi.success({
              message: "Profile Updated",
              description: "Profile Details updated Successfully.",
              placement: "bottomRight",
            });
            setUserData(formData)
          }
        });
    } catch {
      notificationApi.error({ message: "Error", description: "Error on Update", placement: "bottomRight" });

    } finally {
      setLoading(false);
    }
  };





  return (
    <App>
      {contextHolder}
      {!loading && userData ? (
        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={[16, 16]} justify="start" align="middle">
            {/* Left Column */}
            <Col xs={24} sm={24} md={8} lg={8}>
              <Form.Item
                label="Account Name"
                name="name"
                initialValue={userData.name}
                rules={[
                  {
                    required: true,
                    message: "Please enter the account name!",
                  },
                ]}
              >
                <Input placeholder="Enter Address" />
              </Form.Item>

              <Form.Item
                label="Contact Number"
                name="mobile"
                initialValue={userData.mobile}
                rules={[
                  {
                    required: true,
                    message: "Please enter the contact number!",
                  },
                ]}
              >
                <Input placeholder="Enter contact number" />
              </Form.Item>

            </Col>
            {/* Logo Section */}
            <Col xs={24} sm={24} md={8} lg={8} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              <Form.Item label="Profile Image">
                {imageFile?.url && (
                  <Image
                    width="100%"
                    style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "10px" }}
                    src={imageFile.url}
                    alt="Profile Image"
                  />
                )}
              </Form.Item>
              <Upload accept="image/*" beforeUpload={() => false} onChange={(info) => handleImageUpload(info)} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
              <small style={{ marginTop: 10 }}>Recommended JPEG/PNG, size 200x200</small>

            </Col>
          </Row>
          {/* Submit Button */}
          <Row justify="center" style={{ marginTop: "20px" }}>
            <Col xs={24} sm={12} md={6}>
              <Button type="primary" htmlType="submit" block>Save Changes</Button>
            </Col>
          </Row>
        </Form>
      ) : (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      )}
    </App>
  );
}

AccountSettings.propTypes = {
  businessId: PropTypes.any,
  userId: PropTypes.any,
};
