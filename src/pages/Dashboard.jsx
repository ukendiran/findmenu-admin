import { Layout, Row, Col, Card, List, Avatar, Badge, Typography, Space, Button, Empty, Spin } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import ParagraphList from "../components/ParagraphList";
import { MessageOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Text } = Typography;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const getDashboardData = useCallback(async () => {
    setDashboardData([]);
    const response = await apiService.get(`dashboard/counts`, {
      businessId: user.businessId,
    });
    setDashboardData(response.data.data);
  }, [user.businessId]);

  const getRecentFeedback = useCallback(async () => {
    if (!user?.businessId) return;
    
    setLoadingFeedback(true);
    try {
      const response = await apiService.get(`/feedbacks`, {
        businessId: user.businessId,
      });
      if (response.data?.data) {
        // Get the 5 most recent feedback items
        const sorted = response.data.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecentFeedback(sorted);
      }
    } catch (error) {
      console.error('Error fetching recent feedback:', error);
      setRecentFeedback([]);
    } finally {
      setLoadingFeedback(false);
    }
  }, [user?.businessId]);

  useEffect(() => {
    getDashboardData();
    getRecentFeedback();
  }, [getDashboardData, getRecentFeedback]);

  return (
    <div>
      <Content style={{ margin: "16px" }}>
        {/* Responsive Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Main Categories" bordered={false}>
              {dashboardData?.main_category_count ? dashboardData?.main_category_count : 0}{" "}
              Active
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Sub Categories" bordered={false}>
              {dashboardData?.sub_category_count ? dashboardData?.sub_category_count : 0}{" "}
              Active
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Items" bordered={false}>
              {dashboardData?.item_count ? dashboardData?.item_count : 0} Active
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Feedback" bordered={false}>
              {dashboardData?.feedback_count ? dashboardData?.feedback_count : 0} Active
            </Card>
          </Col>

        </Row>

        {/* Recent Feedback Section */}
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <MessageOutlined />
                  <span>Recent Feedback</span>
                </Space>
              }
              bordered={false}
              extra={
                <Button type="link" onClick={() => navigate("/feedback")}>
                  View All
                </Button>
              }
            >
              {loadingFeedback ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Spin size="large" />
                </div>
              ) : recentFeedback.length === 0 ? (
                <Empty
                  description="No feedback received yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={recentFeedback}
                  renderItem={(feedback) => (
                    <List.Item
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <Badge dot={feedback.status === 1} color="blue">
                            <Avatar
                              style={{
                                backgroundColor: "#1677ff",
                                verticalAlign: "middle",
                              }}
                              size="default"
                            >
                              {feedback.senderName?.charAt(0).toUpperCase() || "U"}
                            </Avatar>
                          </Badge>
                        }
                        title={
                          <Space
                            direction="horizontal"
                            style={{
                              justifyContent: "space-between",
                              width: "100%",
                              display: "flex",
                            }}
                          >
                            <Text strong={feedback.status === 1}>
                              {feedback.senderName || "Anonymous"}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {dayjs(feedback.created_at).format("MMM D, YYYY • h:mm A")}
                            </Text>
                          </Space>
                        }
                        description={
                          <ParagraphList text={feedback.message} maxLength={100} />
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Content>
    </div>
  );
};

export default Dashboard;