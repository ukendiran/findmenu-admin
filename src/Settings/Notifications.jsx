import { App, Button, Col, Form, Input, message, notification, Row, Space, Switch } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import apiService from "../services/apiService";
import { updateConfig } from "../store/slices/authSlice";
import { SaveOutlined } from "@ant-design/icons";

export default function Notifications() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [businessConfig, setBusinessConfig] = useState({});
  const [formData, setFormData] = useState({});
  // const user = useSelector((state) => state.auth.user);
  const config = useSelector((state) => state.auth.config);
  const [notificationApi, contextHolder] = notification.useNotification();

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (businessConfig) {
      setFormData({
        reviewStatus: businessConfig.reviewStatus || 2,
        googleReviewStatus: businessConfig.googleReviewStatus || 2,
        googleReview: businessConfig.googleReview || "",
        wifiPasswordStatus: businessConfig.wifiPasswordStatus || 2,
        wifiPassword: businessConfig.wifiPassword || "",
        instagramStatus: businessConfig.instagramStatus || 2,
        instagram: businessConfig.instagram || "",
        facebookStatus: businessConfig.facebookStatus || 2,
        facebook: businessConfig.facebook || "",
        youtubeStatus: businessConfig.youtubeStatus || 2,
        youtube: businessConfig.youtube || "",
        whatsappStatus: businessConfig.whatsappStatus || 2,
        whatsapp: businessConfig.whatsapp || "",
        showFeedbackFormStatus: businessConfig.showFeedbackFormStatus || 1,
      });
    }
  }, [businessConfig]);

  const getData = useCallback(async () => {
    try {
      const response = await apiService.get(`/config/${config.businessId}`);
      setBusinessConfig(response.data.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching business data");
      console.error(error);
      setLoading(false);
    }
  }, [config.businessId]);

  const handleChange = (checked, field) => {
    setHasChanges(true);
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? 1 : 2,
    }));
  };

  const handleInputChange = (value, field) => {
    setHasChanges(true);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    if (!businessConfig.id) {
      message.error("Error: Configuration ID missing");
      return;
    }

    try {
      const config = await apiService.put(`/config/${businessConfig.id}`, formData);
      dispatch(updateConfig(config.data.data));
      notificationApi.success({
        message: "Preferences Saved",
        description: "All preferences were successfully updated.",
      });
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving preferences:", error);
      notificationApi.error({
        message: "Save Failed",
        description: "Failed to save preferences. Please try again.",
      });
      setIsSaving(false);
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
                    value={formData.googleReview}
                    onChange={(e) => handleInputChange(e.target.value, "googleReview")}
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
                    value={formData.instagram}
                    onChange={(e) => handleInputChange(e.target.value, "instagram")}
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
                    value={formData.facebook}
                    onChange={(e) => handleInputChange(e.target.value, "instagram")}
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
                    value={formData.youtube}
                    onChange={(e) => handleInputChange(e.target.value, "youtube")}
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
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange(e.target.value, "whatsapp")}
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
          <Col sm={24} lg={12}>
            <Space>
              <Form.Item label="Show Feedback Form">
                <Space>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={formData.showFeedbackFormStatus === 1}
                    onChange={(checked) => handleChange(checked, "showFeedbackFormStatus")}
                  />
                </Space>
              </Form.Item>
            </Space>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
            className="text-right"
            style={{
              marginTop: 16,
              paddingRight: 8
            }}
          >
            <Button
              type="primary"
              onClick={handleSavePreferences}
              icon={<SaveOutlined />}
              loading={isSaving}
              disabled={isSaving || !hasChanges}
              size="large"
              style={{
                minWidth: 150,
                fontWeight: 500
              }}
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>

          </Col>

        </Row>
      </Form>

    </App >
  );
}

Notifications.propTypes = {
  userData: PropTypes.any,
};
