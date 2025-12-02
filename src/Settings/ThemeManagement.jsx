import { App, Button, Card, Col, ColorPicker, Form, message, Row, Space, Typography, Divider, Radio } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import apiService from "../services/apiService";
import { updateConfig } from "../store/slices/authSlice";
import { SaveOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

// Predefined themes matching findmenu-app themes
const predefinedThemes = [
  { id: 'default', name: 'Grey & White', primary: '#4B5563', secondary: '#6B7280', accent: '#9CA3AF', description: 'Clean grey and white - professional and minimalist' },
  { id: 'slate', name: 'Ash Gray', primary: '#6B7280', secondary: '#9CA3AF', accent: '#D1D5DB', description: 'Elegant ash gray - modern and professional' },
  { id: 'emerald', name: 'Emerald Green', primary: '#059669', secondary: '#10b981', accent: '#34d399', description: 'Fresh emerald - evokes growth and freshness' },
  { id: 'ocean', name: 'Ocean Blue', primary: '#0369a1', secondary: '#0284c7', accent: '#0ea5e9', description: 'Deep ocean blue - inspires trust and calm' },
  { id: 'sunset', name: 'Sunset Orange', primary: '#ea580c', secondary: '#f97316', accent: '#fb923c', description: 'Warm sunset - welcoming and energetic' },
  { id: 'purple', name: 'Royal Purple', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa', description: 'Elegant purple - creative and luxurious' },
  { id: 'rose', name: 'Rose Pink', primary: '#e11d48', secondary: '#f43f5e', accent: '#fb7185', description: 'Elegant rose - modern and sophisticated' },
  { id: 'forest', name: 'Forest Green', primary: '#15803d', secondary: '#16a34a', accent: '#22c55e', description: 'Natural forest - organic and stable' },
  { id: 'midnight', name: 'Midnight Blue', primary: '#1e3a8a', secondary: '#1e40af', accent: '#3b82f6', description: 'Deep midnight - premium and professional' },
  { id: 'crimson', name: 'Crimson Red', primary: '#dc2626', secondary: '#ef4444', accent: '#f87171', description: 'Bold crimson - confident and impactful' },
  { id: 'amber', name: 'Amber Gold', primary: '#d97706', secondary: '#f59e0b', accent: '#fbbf24', description: 'Warm amber - optimistic and friendly' },
  { id: 'cyan', name: 'Cyan Blue', primary: '#0891b2', secondary: '#06b6d4', accent: '#22d3ee', description: 'Fresh cyan - modern and tech-forward' },
  { id: 'indigo', name: 'Indigo Blue', primary: '#4f46e5', secondary: '#6366f1', accent: '#818cf8', description: 'Deep indigo - creative and balanced' },
];

export default function ThemeManagement({ businessId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [businessConfig, setBusinessConfig] = useState({});
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [customColors, setCustomColors] = useState({
    primary: '#4B5563',
    secondary: '#6B7280',
    accent: '#9CA3AF',
  });
  const [useCustom, setUseCustom] = useState(false);
  const config = useSelector((state) => state.auth.config);
  const { notification: notificationApi } = App.useApp();
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = useCallback(async () => {
    try {
      const response = await apiService.get(`/config/${config.businessId}`);
      const configData = response.data.data;
      setBusinessConfig(configData);
      
      // Parse theme from config json or use default
      let themeData = null;
      if (configData.json) {
        try {
          themeData = typeof configData.json === 'string' ? JSON.parse(configData.json) : configData.json;
        } catch (e) {
          console.error('Error parsing theme JSON:', e);
        }
      }
      
      if (themeData?.theme) {
        if (typeof themeData.theme === 'string') {
          setSelectedTheme(themeData.theme);
          setUseCustom(false);
        } else {
          // Custom theme
          setUseCustom(true);
          setCustomColors({
            primary: themeData.theme.primary || customColors.primary,
            secondary: themeData.theme.secondary || customColors.secondary,
            accent: themeData.theme.accent || customColors.accent,
          });
        }
      }
      
      setLoading(false);
    } catch (error) {
      message.error("Error fetching theme data");
      console.error(error);
      setLoading(false);
    }
  }, [config.businessId]);

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    setUseCustom(false);
  };

  const handleCustomColorChange = (colorType, color) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: typeof color === 'string' ? color : color.toHexString(),
    }));
    setUseCustom(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      let themeData;
      if (useCustom) {
        themeData = {
          theme: {
            primary: customColors.primary,
            secondary: customColors.secondary,
            accent: customColors.accent,
          }
        };
      } else {
        themeData = {
          theme: selectedTheme
        };
      }

      // Get existing config or create new
      const configData = businessConfig.json 
        ? (typeof businessConfig.json === 'string' ? JSON.parse(businessConfig.json) : businessConfig.json)
        : {};
      
      const updatedConfig = {
        ...configData,
        ...themeData
      };

      const updateData = {
        json: JSON.stringify(updatedConfig),
      };

      if (!businessConfig.id) {
        // Create new config
        updateData.businessId = config.businessId;
        const response = await apiService.post('/config', updateData);
        dispatch(updateConfig(response.data.data));
      } else {
        // Update existing config
        const response = await apiService.put(`/config/${businessConfig.id}`, updateData);
        dispatch(updateConfig(response.data.data));
      }

      notificationApi.success({
        message: "Theme Saved",
        description: "Your theme preferences have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving theme:", error);
      notificationApi.error({
        message: "Save Failed",
        description: "Failed to save theme. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Loading theme settings...</div>;
  }

  return (
    <Form form={form} layout="vertical">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={4}>Theme Selection</Title>
          <Paragraph type="secondary">
            Choose a predefined theme or create a custom color scheme for your business menu.
          </Paragraph>
        </div>

        <Divider />

        <div>
          <Title level={5}>Predefined Themes</Title>
          <Radio.Group 
            value={useCustom ? null : selectedTheme} 
            onChange={(e) => handleThemeSelect(e.target.value)}
            style={{ width: '100%' }}
          >
            <Row gutter={[16, 16]}>
              {predefinedThemes.map((theme) => (
                <Col xs={24} sm={12} md={8} lg={6} key={theme.id}>
                  <Radio.Button value={theme.id} style={{ width: '100%', height: 'auto', padding: 0 }}>
                    <Card
                      hoverable
                      style={{
                        border: selectedTheme === theme.id && !useCustom ? `3px solid ${theme.primary}` : '1px solid #d9d9d9',
                        borderRadius: 8,
                        margin: 0,
                        cursor: 'pointer',
                      }}
                      styles={{ body: { padding: '16px' } }}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div
                          style={{
                            height: '60px',
                            borderRadius: 6,
                            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                            marginBottom: 8,
                          }}
                        />
                        <Text strong style={{ fontSize: 14, display: 'block' }}>
                          {theme.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                          {theme.description}
                        </Text>
                      </Space>
                    </Card>
                  </Radio.Button>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </div>

        <Divider>OR</Divider>

        <div>
          <Title level={5}>Custom Colors</Title>
          <Paragraph type="secondary">
            Create your own color scheme by selecting custom colors.
          </Paragraph>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong>Primary Color</Text>
                <ColorPicker
                  value={customColors.primary}
                  onChange={(color) => handleCustomColorChange('primary', color)}
                  showText
                  format="hex"
                />
                <div
                  style={{
                    height: '40px',
                    borderRadius: 6,
                    background: customColors.primary,
                    border: '1px solid #d9d9d9',
                  }}
                />
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong>Secondary Color</Text>
                <ColorPicker
                  value={customColors.secondary}
                  onChange={(color) => handleCustomColorChange('secondary', color)}
                  showText
                  format="hex"
                />
                <div
                  style={{
                    height: '40px',
                    borderRadius: 6,
                    background: customColors.secondary,
                    border: '1px solid #d9d9d9',
                  }}
                />
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong>Accent Color</Text>
                <ColorPicker
                  value={customColors.accent}
                  onChange={(color) => handleCustomColorChange('accent', color)}
                  showText
                  format="hex"
                />
                <div
                  style={{
                    height: '40px',
                    borderRadius: 6,
                    background: customColors.accent,
                    border: '1px solid #d9d9d9',
                  }}
                />
              </Space>
            </Col>
          </Row>
          <div style={{ marginTop: 16 }}>
            <Card
              style={{
                background: `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary} 100%)`,
                borderRadius: 8,
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
                Preview: Custom Theme
              </Text>
            </Card>
          </div>
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={isSaving}
            size="large"
          >
            Save Theme
          </Button>
        </div>
      </Space>
    </Form>
  );
}

ThemeManagement.propTypes = {
  businessId: PropTypes.number.isRequired,
};

