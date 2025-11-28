import { Row, Col, Card, Button, Typography, List,  message, Spin, notification, App } from "antd";
import { CheckOutlined, ArrowRightOutlined} from "@ant-design/icons";
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const RenewSubscription = () => {
    const { notification: notificationApi } = App.useApp();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    // Get modal instance from App component
    const { modal } = App.useApp();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await apiService.get('/plans-renew');
            setPlans(res.data.data);
        } catch (error) {
            message.error('Failed to fetch plans');
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const showConfirmSubscription = (plan) => {
        setSelectedPlan(plan);

        // Use modal from App component instead of static confirm
        modal.confirm({
            title: `Confirm ${plan.name} Subscription Renewal`,
            content: (
                <div>
                    <p>You are about to renew your subscription with the following plan:</p>
                    <p><strong>Plan:</strong> {plan.name}</p>
                    <p><strong>Price:</strong> ₹{plan.price} / {plan.billing_period}</p>
                    <p>This will initiate the payment process. Are you sure you want to proceed?</p>
                </div>
            ),
            okText: 'Yes, Proceed to Payment',
            cancelText: 'Cancel',
            okType: 'primary',
            onOk() {
                return handleSubscription(plan.id);
            },
            onCancel() {
                setSelectedPlan(null);
            },
        });
    };

    const handleSubscription = async (planId) => {
        try {
            setSubscribing(true);
            const res = await apiService.post('/phonepe/initiate', {
                planId: planId,
                businessId: user.businessId
            });

            if (res.data.success) {
                // Open payment URL in new tab
                // window.open(res.data.payment_url, '_blank');

                // Show success message and start polling for payment status
                notificationApi.error({
                    message: "Please Contact Admin",
                    description: res.data?.message || "Please Contact Admin",
                });
                // startPaymentStatusPolling(planId);
            } else {
                message.error('Failed to initiate payment');
            }
        } catch (err) {
            console.error('Payment initiation error:', err);
        } finally {
            setSubscribing(false);
            setSelectedPlan(null);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <div style={{ padding: '24px' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
                    Renew Your Subscription
                </Title>

                <Row gutter={[24, 24]} justify="center">
                    {plans.map((plan) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={plan.id}>
                            <Card
                                title={
                                    <Title level={4} style={{ marginBottom: 0, textAlign: 'center' }}>
                                        {plan.name}
                                    </Title>
                                }
                                bordered
                                hoverable
                                style={{
                                    borderRadius: 12,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ fontSize: 24, display: 'block', textAlign: 'center' }}>
                                        ₹{plan.price}
                                        <Text type="secondary" style={{ fontSize: 14 }}>
                                            / {plan.billing_period}
                                        </Text>
                                    </Text>

                                    <List
                                        size="small"
                                        dataSource={plan.features || []}
                                        style={{ marginTop: 16, marginBottom: 24 }}
                                        renderItem={(feature) => (
                                            <List.Item style={{ border: 'none', padding: '4px 0' }}>
                                                <CheckOutlined style={{ color: 'green', marginRight: 8 }} />
                                                {feature}
                                            </List.Item>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="primary"
                                    block
                                    icon={<ArrowRightOutlined />}
                                    loading={subscribing && selectedPlan?.id === plan.id}
                                    onClick={() => showConfirmSubscription(plan)}
                                    style={{ marginTop: 'auto' }}
                                >
                                    Renew Now
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Additional information section */}
                <Card style={{ marginTop: 32 }}>
                    <Title level={4}>Subscription Renewal Information</Title>
                    <List>
                        <List.Item>
                            <CheckOutlined style={{ color: 'green', marginRight: 8 }} />
                            Instant activation after successful payment
                        </List.Item>
                        <List.Item>
                            <CheckOutlined style={{ color: 'green', marginRight: 8 }} />
                            No interruption to your service
                        </List.Item>
                        <List.Item>
                            <CheckOutlined style={{ color: 'green', marginRight: 8 }} />
                            Secure payment processing
                        </List.Item>
                    </List>
                </Card>
            </div>
        </>
    );
};