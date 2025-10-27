import {
  Layout,
  List,
  Avatar,
  notification,
  App,
  Typography,
  Card,
  Spin,
  Empty,
  Input,
  Row,
  Col,
} from "antd";
import { MessageOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import apiService from "../services/apiService";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import ParagraphList from "../components/ParagraphList";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Feedback = () => {
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, data]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/feedbacks`, {
        businessId: user.businessId,
      });

      if (response.data?.data) {
        const dataWithKeys = response.data.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));
        setData(dataWithKeys);
        setFilteredData(dataWithKeys);
      }
    } catch (err) {
      console.error(err);
      notificationApi.error({
        message: "Error",
        description: `Failed to fetch feedback. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredData(data);
      return;
    }

    const term = search.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.senderName?.toLowerCase().includes(term) ||
        item.message?.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  return (
    <App>
      {contextHolder}
      <Layout style={{ height: "100vh", background: "#f5f7fa" }}>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MessageOutlined style={{ fontSize: 24, color: "#1677ff", marginRight: 10 }} />
          <Title level={3} style={{ margin: 0 }}>
            Customer Feedback
          </Title>
        </Header>

        {/* Content */}
        <Content style={{ padding: "24px", overflowY: "auto" }}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              background: "#fff",
            }}
          >
            {/* Search Bar */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={16} md={10}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search by name or message"
                  allowClear
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
            </Row>

            {/* Feedback List */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <Spin tip="Loading feedback..." size="large" />
              </div>
            ) : filteredData.length === 0 ? (
              <Empty description="No feedback found" style={{ padding: "60px 0" }} />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={filteredData}
                pagination={{ pageSize: 8, position: "bottom", align: "center" }}
                renderItem={(feedback) => (
                  <List.Item
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid #f0f0f0",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: "#1677ff",
                            fontWeight: "bold",
                          }}
                        >
                          {feedback.senderName?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                      }
                      title={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <Text strong style={{ fontSize: 16 }}>
                            {feedback.senderName || "Anonymous"}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}
                          </Text>
                        </div>
                      }
                      description={
                        <ParagraphList text={feedback.message} maxLength={200} />
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Content>
      </Layout>
    </App>
  );
};

export default Feedback;
