import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  List,
  message,
  Spin,
  notification,
  App,
  Table,
  Tag,
  Divider,
  Statistic,
  Timeline,
  Space,
  Select,
  DatePicker,
  Input
} from "antd";
import {
  CheckOutlined,
  DollarOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import apiService from '../services/apiService';
import { useSelector } from 'react-redux';
import { RenewSubscription } from './RenewSubscription';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;


export const Payments = () => {
  const { notification: notificationApi } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const [stats, setStats] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [searchText, setSearchText] = useState('');
  const user = useSelector((state) => state.auth.user);
  const { modal } = App.useApp();

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      // In a real app, these would be actual API calls
      const [historyRes, planRes, billingRes] = await Promise.all([
        apiService.get('/payment-history'),
        apiService.get('/current-plan'),
        apiService.get('/billing-info')
      ]);

      setPaymentHistory([]);
      setCurrentPlan([]);
      setBillingInfo([]);

      // Calculate some stats
      const totalPaid = historyRes.data.data
        .filter(item => item.status === 'success')
        .reduce((sum, item) => sum + item.amount, 0);

      const successfulPayments = historyRes.data.data
        .filter(item => item.status === 'success').length;

      setStats({
        totalPaid,
        successfulPayments,
        totalTransactions: 0
      });
    } catch (error) {
      message.error('Failed to fetch payment data');
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (paymentId) => {
    message.success(`Downloading invoice for payment #${paymentId}`);
    // In a real app, this would download the actual invoice
  };

  const handleUpdateBilling = () => {
    modal.info({
      title: 'Update Billing Information',
      content: (
        <div>
          <p>This feature would allow you to update your payment method and billing details.</p>
        </div>
      ),
    });
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString()
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₹${amount}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'success' ? 'green' : status === 'pending' ? 'orange' : 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Invoice',
      key: 'action',
      render: (_, record) => (
        <Button
          icon={<DownloadOutlined />}
          size="small"
          onClick={() => handleDownloadInvoice(record.id)}
        >
          Invoice
        </Button>
      ),
    },
  ];

  const filteredData = paymentHistory.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.description.toLowerCase().includes(searchText.toLowerCase());

    let matchesDate = true;
    if (dateRange.length === 2) {
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);
      const itemDate = new Date(item.date);
      matchesDate = itemDate >= startDate && itemDate <= endDate;
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const items = [
    {
      color: 'green',
      dot: '.',
      children: 'Created a service site 2015-09-01',
    },
    {
      color: 'red',
      children: 'Solve initial network problems 2015-09-01',
    },
    {
      children: 'Technical testing 2015-09-01',
    },
  ];



  return (
    <>
      <div style={{ padding: '24px' }}>
        <Title level={2} style={{ marginBottom: '32px' }}>
          <DollarOutlined /> Payments & Billing
        </Title>

        {/* Stats Overview */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Paid"
                value={stats.totalPaid}
                precision={2}
                prefix="₹"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Successful Payments"
                value={stats.successfulPayments}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Transactions"
                value={stats.totalTransactions}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Current Plan Details */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <span>
                  <FileTextOutlined /> Current Plan
                </span>
              }
              style={{ marginBottom: '24px' }}
            >
              {currentPlan ? (
                <>
                  <Title level={3}>{currentPlan.name}</Title>
                  <Text strong style={{ fontSize: '20px' }}>
                    ₹{currentPlan.price} / {currentPlan.billing_period}
                  </Text>

                  <Divider />

                  <List
                    size="small"
                    dataSource={currentPlan.features || []}
                    renderItem={(feature) => (
                      <List.Item style={{ border: 'none', padding: '4px 0' }}>
                        <CheckOutlined style={{ color: 'green', marginRight: 8 }} />
                        {feature}
                      </List.Item>
                    )}
                  />

                  <Button
                    type="primary"
                    block
                    style={{ marginTop: '16px' }}
                    onClick={() => window.location.hash = '#renew'}
                  >
                    Manage Subscription
                  </Button>
                </>
              ) : (
                <Text>No active subscription</Text>
              )}
            </Card>

            {/* Billing Information */}
            <Card
              title={
                <span>
                  <CreditCardOutlined /> Billing Information
                </span>
              }
            >
              {billingInfo ? (
                <>
                  <p><strong>Card:</strong> **** **** **** {billingInfo.last4}</p>
                  <p><strong>Expiry:</strong> {billingInfo.exp_month}/{billingInfo.exp_year}</p>
                  <p><strong>Billing Email:</strong> {billingInfo.email}</p>

                  <Button type="default" block onClick={handleUpdateBilling}>
                    Update Billing Info
                  </Button>
                </>
              ) : (
                <Text>No billing information available</Text>
              )}
            </Card>
          </Col>

          {/* Payment History */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <span>
                  <HistoryOutlined /> Payment History
                </span>
              }
              extra={
                <Space>
                  <Search
                    placeholder="Search payments..."
                    onSearch={setSearchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                  />
                  <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={setFilterStatus}
                  >
                    <Option value="all">All Status</Option>
                    <Option value="success">Success</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="failed">Failed</Option>
                  </Select>
                  <RangePicker onChange={dates => setDateRange(dates)} />
                </Space>
              }
            >
              <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
                scroll={{ x: true }}
                rowKey="id"
              />
            </Card>

            {/* Upcoming Billing */}
            <Card title="Upcoming Billing" style={{ marginTop: '24px' }}>
              <Timeline items={items} />
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Renew Subscription Section */}
        <div id="renew">
          <Title level={3}>Renew or Change Plan</Title>
          <RenewSubscription />
        </div>
      </div>
    </>
  );
};