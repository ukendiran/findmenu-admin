import { Layout, Menu, List, Avatar, Badge, message, notification, Tooltip, Space, App } from "antd";
import {
  InboxOutlined,
  // InboxOutlined,
  SendOutlined,

} from "@ant-design/icons";
import { useEffect, useState } from "react";
import apiService from "../services/apiService";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import ParagraphList from "../components/ParagraphList";

const { Header, Content, Sider } = Layout;

const Feedback = () => {
  const token = useSelector((state) => state.auth.token);
  const user = token.data;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedKey, setSelectedKey] = useState("new");
  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchFeedback("new");
  }, []);

  const fetchFeedback = async (status) => {
    setLoading(true);

    try {
      const response = await apiService.post(`/feedback/byStatus`, {
        restaurantId: user.restaurantId,
        status: status,
      });
      if (response.data?.data) {
        const dataWithKeys = response.data.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));
        setData(dataWithKeys);
      }
    } catch {
      message.error("Failed to fetch feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (item) => {
    setSelectedKey(item.key);
    fetchFeedback(item.key);
  };

  const handleRead = (item, status, action) => {
    try {
      // const newStatus = action === 'new' ? 2 : 3
      apiService.put(`/feedback/${item.key}`, { status: status }).then(() => {
        if (action === 'new') {
          notificationApi.success({
            message: "Success",
            description: `Feedback marked as read.`,
          });
        } else {
          notificationApi.error({
            message: "Deleted",
            description: `Feedback Deleted.`,
          });
        }
        fetchFeedback(action);
      });

    } catch (error) {
      console.error("Error updating message:", error);
      notificationApi.error({
        message: "Update Failed",
        description: "Failed to update item availability. Please try again.",
      });
    }
  };

  const menuItems = [
    {
      key: "new",
      icon: <InboxOutlined />,
      label: "New",
    },
    {
      key: "all",
      icon: <SendOutlined />,
      label: "All",
    },
  ];

  return (
    <App>
      {contextHolder}
      <Layout style={{ height: "100vh", minWidth: "320px" }}>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "20px", flexGrow: 1 }}>Feedback</h1>

        </Header>

        <Layout>
          {/* Sidebar */}
          <Sider
            theme="light"
            width={200}
            breakpoint="md"
            collapsedWidth="0"
            style={{ borderRight: "1px solid #f0f0f0" }}
          >


            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={handleClick}
              items={menuItems}
            />

          </Sider>

          {/* Content */}
          <Content style={{ padding: "16px" }}>
            {!loading && (
              <List
                itemLayout="horizontal"
                dataSource={data}
                pagination={{ pageSize: 10 }}
                renderItem={(email) => (
                  <List.Item
                    style={{
                      padding: "12px",
                      cursor: "pointer",
                      marginBottom: 3,
                      background: "#fff",
                      borderRadius: "4px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: "#87d068" }}>
                          {email.senderName?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                      }
                      title={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>{email.senderName || "New User"}</span>
                          <Space style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "12px", color: "gray" }}>
                              {dayjs(email.createdAt).format("MMM D, YYYY h:mm A")}
                              {email.status === 1 && <Badge style={{ marginLeft: 5 }} status="success" />}
                              <br />
                              {email.status === 1 && (
                                <Tooltip
                                  title="Click to Mark as Read"
                                  onClick={() => handleRead(email, 2, 'new')}
                                  key={email.id}>Mark as Read
                                </Tooltip>
                              )}
                              {email.status === 1 ? "" : (
                                <Tooltip
                                  title="Click to Delete"
                                  onClick={() => handleRead(email, 3, 'all')}
                                  key={email.id}>Delete
                                </Tooltip>
                              )}
                            </span>
                          </Space>

                        </div>
                      }
                      description={
                        <ParagraphList text={email.message} maxLength={100} />
                      }
                    />

                  </List.Item>
                )}
              />
            )}
          </Content>
        </Layout>
      </Layout>
    </App>
  );
};

export default Feedback;
