
import { Typography, List, Col, Row, Layout, Divider } from 'antd';

const { Title, Paragraph } = Typography;

const RefundPolicy = () => (
    <Layout style={{ padding: "50px 0" }}>
        <Row justify="center">
            <Col xs={24} sm={20} md={16} lg={12}>
                <Typography>
                    <Title level={1}>Refund Policy</Title>
                    <Divider />
                    <Title level={2}>1. Legal Compliance</Title>
                    <Paragraph>
                        Our refund policy adheres to the following Indian laws and guidelines:
                    </Paragraph>
                    <List
                        dataSource={[
                            'Consumer Protection Act, 2019: Ensures transparency in pricing, services, and refunds for SaaS businesses.',
                            'Information Technology Act, 2000, and E-commerce Rules, 2020: Applicable to online services, governing electronic transactions and consumer rights.',
                            'RBI Guidelines: Impact refund policies concerning recurring payments and chargebacks.',
                        ]}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />

                    <Title level={2}>2. Key Refund Policy Elements</Title>

                    <Title level={3}>A. Free Trial & No Refund for Paid Plans</Title>
                    <Paragraph>
                        We offer a [30-day] free trial period. Once you subscribe to a paid plan, all payments are non-refundable.
                    </Paragraph>

                    <Title level={3}>B. Refund on Cancellation</Title>
                    <Paragraph>
                        Cancellations will take effect at the start of the next billing cycle. No partial refunds are issued.
                    </Paragraph>

                    <Title level={3}>C. Chargebacks & Fraudulent Payments</Title>
                    <Paragraph>
                        If you believe an unauthorized transaction has occurred, contact us within [30 days] for review.
                    </Paragraph>

                    <Title level={3}>D. Enterprise or Custom Plans</Title>
                    <Paragraph>
                        Enterprise or custom plans may have different refund terms, such as contract-based no refund policies.
                    </Paragraph>

                    <Title level={2}>3. Best Practices</Title>
                    <List
                        dataSource={[
                            'Clearly communicate refund policies at checkout.',
                            'Provide a grace period if needed (e.g., “Full refund if canceled within 24 hours of payment”).',
                            'Offer credits instead of refunds where possible.',
                        ]}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />

                    <Paragraph>
                        Thank you for using Find Menu. We are happy to start this business with you.
                    </Paragraph>
                </Typography>
            </Col>
        </Row>
    </Layout>
);

export default RefundPolicy;
