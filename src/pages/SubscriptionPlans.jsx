import { Row, Col, Card, Button, Typography, List } from "antd";
import { CheckOutlined, ArrowRightOutlined } from "@ant-design/icons";

import { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

export const SubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const user = useSelector((state) => state.auth.user);


    useEffect(() => {
        apiService.get('/plans-renew').then(res => {
            setPlans(res.data.data)
            console.log(res.data.data)
        });
    }, []);

    // const subscribeToPlan = async (planId) => {
    //     try {
    //         const res = await apiService.post('/phonepe/initiate', {
    //             planId: planId,
    //             businessId: user.businessId
    //         });
    //         window.location.href = res.data.payment_url;
    //     } catch (err) {
    //         message.error("Payment initiation failed");
    //     }
    // };

    const subscribeToPlan = async (planId) => {
        try {
            console.log(planId)
        } catch (err) {
            message.error("Payment initiation failed");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Row gutter={[24, 24]} justify="center" style={{ textAlign: 'center' }}>
                {plans.map((plan) => (
                    <Col xs={24} sm={12} md={12} lg={8} key={plan.id}>
                        <Card
                            title={<Title level={4} style={{ marginBottom: 0 }}>{plan.name}</Title>}
                            bordered
                            hoverable
                            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        >
                            <Text strong style={{ fontSize: 18 }}>
                                ₹{plan.price} <Text type="secondary">/ {plan.billing_period}</Text>
                            </Text>

                            <List
                                size="small"
                                dataSource={plan.features || []}
                                style={{ marginTop: 16, marginBottom: 24 }}
                                renderItem={(feature) => (
                                    <List.Item>
                                        <CheckOutlined style={{ color: 'green', marginRight: 8 }} />
                                        {feature}
                                    </List.Item>
                                )}
                            />

                            <Button
                                type="primary"
                                block
                                icon={<ArrowRightOutlined />}
                                onClick={() => subscribeToPlan(plan.id)}
                            >
                                Renew
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};