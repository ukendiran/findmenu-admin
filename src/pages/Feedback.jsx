import {
  Layout,
  List,
  Avatar,
  notification,
  Typography,
  Space,
  Card,
  Spin,
  Empty,
  App,
  Input,
  Row,
  Col,
  Button,
  Tabs,
  Badge,
  DatePicker,
} from "antd";
import { useEffect, useState, useCallback } from "react";
import apiService from "../services/apiService";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import ParagraphList from "../components/ParagraphList";
import { SearchOutlined, CheckOutlined, CalendarOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const { Content } = Layout;
const { Title, Text } = Typography;

const Feedback = () => {
  const user = useSelector((state) => state.auth.user);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [activeTab, setActiveTab] = useState("new"); // "new" or "all"

  useEffect(() => {
    if (user?.businessId) {
      if (activeTab === "new") {
        fetchFeedback("", 1, dateRange);
      } else {
        fetchFeedback("", null, dateRange);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.businessId, activeTab, dateRange]);

  const fetchFeedback = useCallback(async (query = "", status = null, dateRangeValue = null) => {
    if (!user?.businessId) return;

    setLoading(true);
    try {
      const params = {
        businessId: user.businessId,
      };
      if (query) {
        params.message = query;
      }
      if (status !== null) {
        params.status = status;
      }
      if (dateRangeValue && dateRangeValue.length === 2) {
        params.dateFrom = dateRangeValue[0].format('YYYY-MM-DD');
        params.dateTo = dateRangeValue[1].format('YYYY-MM-DD');
      }

      const response = await apiService.get(`/feedbacks`, params);
      if (response.data?.data) {
        const dataWithKeys = response.data.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));
        setData(dataWithKeys);
      }
    } catch {
      notificationApi.error({
        message: "Error",
        description: `Failed to fetch feedback. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  }, [user?.businessId, notificationApi]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "new") {
      fetchFeedback(searchText.trim(), 1, dateRange);
    } else {
      fetchFeedback(searchText.trim(), null, dateRange);
    }
  };

  const handleSearch = () => {
    if (activeTab === "new") {
      fetchFeedback(searchText.trim(), 1, dateRange);
    } else {
      fetchFeedback(searchText.trim(), null, dateRange);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleReset = () => {
    setSearchText("");
    setDateRange(null);
    if (activeTab === "new") {
      fetchFeedback("", 1, null);
    } else {
      fetchFeedback("", null, null);
    }
  };

  const handleMarkAsRead = async (feedbackId) => {
    try {
      await apiService.put(`/feedbacks/${feedbackId}/mark-read`);
      notificationApi.success({
        message: "Success",
        description: "Feedback marked as read",
      });
      // Refresh the list
      if (activeTab === "new") {
        fetchFeedback(searchText.trim(), 1, dateRange);
      } else {
        fetchFeedback(searchText.trim(), null, dateRange);
      }
    } catch (err) {
      console.error(err);
      notificationApi.error({
        message: "Error",
        description: "Failed to mark feedback as read",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.businessId) return;

    try {
      const response = await apiService.put(`/feedbacks/mark-all-read`, {
        businessId: user.businessId,
      });

      console.log("All feedbacks marked as read", response);
      notificationApi.success({
        message: "Success",
        description: "All feedbacks marked as read",
      });
      // Refresh the list
      if (activeTab === "new") {
        fetchFeedback(searchText.trim(), 1, dateRange);
      } else {
        fetchFeedback(searchText.trim(), null, dateRange);
      }
    } catch (err) {
      console.error(err);
      notificationApi.error({
        message: "Error",
        description: "Failed to mark all feedbacks as read",
      });
    }
  };

  return (
    <App>
      {contextHolder}
      <Layout style={{ minHeight: "100vh", background: "#f9fafb", width: "100%" }}>
        <Content style={{ padding: "24px", width: "100%",  margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Title level={3} style={{ margin: 0 }}>
              Customer Feedback
            </Title>
            {activeTab === "new" && data.length > 0 && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleMarkAllAsRead}
              >
                Mark All as Read
              </Button>
            )}
          </div>

          <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
            View what your customers are saying about your business.
          </Text>

          {/* Filter Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={[
              {
                key: "new",
                label: (
                  <Badge count={data.filter((item) => item.status === 1).length} size="small">
                    <span>New</span>
                  </Badge>
                ),
              },
              {
                key: "all",
                label: "All",
              },
            ]}
            style={{ marginBottom: 20 }}
          />

          {/* 🔍 Search Bar */}
          <Row gutter={12} style={{ marginBottom: 20 }}>
            <Col flex="auto">
              <Input
                placeholder="Search by message..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />
            </Col>
            <Col>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                placeholder={["Start Date", "End Date"]}
                style={{ width: 280 }}
                allowClear
              />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Col>
            <Col>
              <Button onClick={handleReset}>Reset</Button>
            </Col>
          </Row>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Spin size="large" />
            </div>
          ) : data.length === 0 ? (
            <Empty
              description="No feedback received yet"
              style={{ marginTop: 60 }}
            />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={data}
              pagination={{
                pageSize: 10,
                align: "center",
              }}
              renderItem={(feedback) => (
                <Card
                  key={feedback.id}
                  style={{
                    marginBottom: 16,
                    borderRadius: 10,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    background: feedback.status === 1 ? "#f0f7ff" : "#fff",
                  }}
                  styles={{ body: { padding: 16 } }}
                  actions={[
                    feedback.status === 1 && (
                      <Button
                        type="link"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => handleMarkAsRead(feedback.id)}
                      >
                        Mark as Read
                      </Button>
                    ),
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={feedback.status === 1} color="blue">
                        <Avatar
                          style={{
                            backgroundColor: "#1677ff",
                            verticalAlign: "middle",
                          }}
                          size="large"
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
                        <Text strong={feedback.status === 1}>{feedback.senderName || "Anonymous"}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {dayjs(feedback.created_at).format(
                            "MMM D, YYYY • h:mm A"
                          )}
                        </Text>
                      </Space>
                    }
                    description={
                      <ParagraphList text={feedback.message} maxLength={150} />
                    }
                  />
                </Card>
              )}
            />
          )}
        </Content>
      </Layout>
    </App>
  );
};

export default Feedback;
