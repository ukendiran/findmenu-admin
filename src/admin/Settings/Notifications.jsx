import { App, Button, Col, Form, Input, message, notification, Row, Space, Switch } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import apiService from "../../services/apiService";

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [restaurantConfig, setRestaurantConfig] = useState({});
  const [formData, setFormData] = useState({});
  const token = useSelector((state) => state.auth.token);
  const config = token.data;
  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (restaurantConfig) {
      setFormData({
        reviewStatus: restaurantConfig.reviewStatus || 2,
        googleReviewStatus: restaurantConfig.googleReviewStatus || 2,
        googleReviewLink: restaurantConfig.googleReviewLink || "",
        wifiPasswordStatus: restaurantConfig.wifiPasswordStatus || 2,
        wifiPassword: restaurantConfig.wifiPassword || "",
        instagramStatus: restaurantConfig.instagramStatus || 2,
        instagramLink: restaurantConfig.instagramLink || "",
        facebookStatus: restaurantConfig.facebookStatus || 2,
        facebookLink: restaurantConfig.facebookLink || "",
        youtubeStatus: restaurantConfig.youtubeStatus || 2,
        youtubeLink: restaurantConfig.youtubeLink || "",
        whatsappStatus: restaurantConfig.whatsappStatus || 2,
        whatsappLink: restaurantConfig.whatsappLink || "",
      });
    }
  }, [restaurantConfig]);

  const getData = async () => {
    try {
      const response = await apiService.get(`/restaurantconfig/${config.restaurantId}`);
      setRestaurantConfig(response.data.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching restaurant data");
      console.error(error);
      setLoading(false);
    }
  };

  const handleChange = (checked, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? 1 : 2,
    }));
  };

  const handleInputChange = (value, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePreferences = async () => {
    if (!restaurantConfig.id) {
      message.error("Error: Configuration ID missing");
      return;
    }

    try {
      await apiService.put(`/restaurantconfig/${restaurantConfig.id}`, formData);
      notificationApi.success({
        message: "Preferences Saved",
        description: "All preferences were successfully updated.",
        placement: "bottomRight",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      notificationApi.error({
        message: "Save Failed",
        description: "Failed to save preferences. Please try again.",
        placement: "bottomRight",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <App>
      {contextHolder}

      <Form layout="vertical">
        <Row gutter={[24]}>
          <Col sm={24} lg={12}>
            <Space >
              <Form.Item label="Rating">
                <Switch
                  checkedChildren="On"
                  unCheckedChildren="Off"
                  checked={formData.reviewStatus === 1}
                  onChange={(checked) => handleChange(checked, "reviewStatus")}
                />
              </Form.Item>

              <Form.Item label="Google Review">
                <Space>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={formData.googleReviewStatus === 1}
                    onChange={(checked) => handleChange(checked, "googleReviewStatus")}
                  />
                  {/* {formData.googleReviewStatus === 1 && (
                  <Input
                    placeholder="Enter Google Review Link"
                    value={formData.googleReviewLink}
                    onChange={(e) => handleInputChange(e.target.value, "googleReviewLink")}
                  />
                )} */}
                </Space>
              </Form.Item>

              <Form.Item label="Instagram">
                <Space>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={formData.instagramStatus === 1}
                    onChange={(checked) => handleChange(checked, "instagramStatus")}
                  />
                  {/* {formData.instagramStatus === 1 && (
                  <Input
                    placeholder="Enter Instagram"
                    value={formData.instagramLink}
                    onChange={(e) => handleInputChange(e.target.value, "instagramLink")}
                  />
                )} */}
                </Space>
              </Form.Item>
            </Space>
          </Col>
          <Col sm={24} lg={12}>
            <Space >

              <Form.Item label="FaceBook">
                <Space>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={formData.facebookStatus === 1}
                    onChange={(checked) => handleChange(checked, "facebookStatus")}
                  />
                  {/* {formData.facebookStatus === 1 && (
                  <Input
                    placeholder="Enter Facebook"
                    value={formData.facebookLink}
                    onChange={(e) => handleInputChange(e.target.value, "instagramLink")}
                  />
                )} */}
                </Space>
              </Form.Item>
              <Form.Item label="YouTube">
                <Space>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={formData.youtubeStatus === 1}
                    onChange={(checked) => handleChange(checked, "youtubeStatus")}
                  />
                  {/* {formData.youtubeStatus === 1 && (
                  <Input
                    placeholder="Enter Youtube"
                    value={formData.youtubeLink}
                    onChange={(e) => handleInputChange(e.target.value, "youtubeLink")}
                  />
                )} */}
                </Space>
              </Form.Item>
              <Form.Item label="WhatsApp Business">
                <Space>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={formData.whatsappStatus === 1}
                    onChange={(checked) => handleChange(checked, "whatsappStatus")}
                  />
                  {/* {formData.whatsappStatus === 1 && (
                  <Input
                    placeholder="Enter Whatsapp"
                    value={formData.whatsappLink}
                    onChange={(e) => handleInputChange(e.target.value, "whatsappLink")}
                  />
                )} */}
                </Space>
              </Form.Item>
            </Space>
          </Col>

          <Col sm={24} lg={12}>
            <Space>
              <Form.Item label="Wifi Password">
                <Space>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={formData.wifiPasswordStatus === 1}
                    onChange={(checked) => handleChange(checked, "wifiPasswordStatus")}
                  />
                  {formData.wifiPasswordStatus === 1 && (
                    <Input
                      placeholder="Enter Wifi Password"
                      value={formData.wifiPassword}
                      onChange={(e) => handleInputChange(e.target.value, "wifiPassword")}
                    />
                  )}
                </Space>
              </Form.Item>
            </Space>
          </Col>

          <Button type="primary" onClick={handleSavePreferences}>
            Save Preferences
          </Button>


        </Row>
      </Form>

    </App >
  );
}

Notifications.propTypes = {
  userData: PropTypes.any,
};
