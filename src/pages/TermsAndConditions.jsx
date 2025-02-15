import { Layout, Typography, Divider, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const TermsAndConditions = () => {
    return (
        <Layout style={{ padding: "50px 0" }}>
            <Row justify="center">
                <Col xs={24} sm={20} md={16} lg={12}>
                    <Title level={1}>Terms and Conditions</Title>
                    <Divider />
                    <Paragraph style={{ color: "rgba(0, 0, 0, 0.65)" }}>
                        Last Updated: January 28, 2025
                    </Paragraph>

                    <Paragraph>
                        Welcome to FindMenu! These Terms and Conditions outline the rules and regulations for the use of our website and services. By accessing or using FindMenu, you agree to comply with these terms. If you do not agree with any part of these terms, please do not use our services.
                    </Paragraph>

                    <Divider />

                    <Title level={3}>1. Acceptance of Terms</Title>
                    <Paragraph>
                        By using our website and services, you confirm that you are at least 18 years old and have the legal capacity to enter into these Terms and Conditions. If you are using the services on behalf of a company or organization, you represent that you have the authority to bind that entity to these terms.
                    </Paragraph>

                    <Title level={3}>2. Services Provided</Title>
                    <Paragraph>
                        FindMenu offers contactless and eco-friendly menus for businesses, integrated with Google Reviews, TripAdvisor, and other review platforms, designed to streamline the discovery phase of digital sales. We also offer integration with customer relationship management (CRM) systems.
                    </Paragraph>

                    <Title level={3}>3. User Accounts</Title>
                    <Paragraph>
                        To access certain features of our services, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </Paragraph>

                    <Title level={3}>4. Payment Terms</Title>
                    <Paragraph>
                        By subscribing to our services, you agree to pay all fees associated with your chosen plan. Payment is due upon subscription and will be billed monthly or annually as specified during the signup process. We reserve the right to change our pricing at any time; however, existing subscribers will be notified prior to any changes.
                    </Paragraph>

                    <Title level={3}>5. Cancellation and Refund Policy</Title>
                    <Paragraph>
                        You may cancel your subscription at any time through your account settings. Refunds will be provided according to our current usage refund policy, which is available on our website.
                    </Paragraph>

                    <Title level={3}>6. User Conduct</Title>
                    <Paragraph>
                        You agree not to use our services for any unlawful purpose or in a manner that could damage, disable, overburden, or impair the website or interfere with any other party’s use of the services. Prohibited activities include but are not limited to:
                        <ul>
                            <li>Sending unsolicited communications (spam)</li>
                            <li>Impersonating any person or entity</li>
                            <li>Transmitting harmful or malicious code</li>
                        </ul>
                    </Paragraph>

                    <Title level={3}>7. Intellectual Property</Title>
                    <Paragraph>
                        All content on FindMenu.in, including text, graphics, logos, and software, is the property of Crution Private Limited or its licensors and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written consent.
                    </Paragraph>

                    <Title level={3}>8. Limitation of Liability</Title>
                    <Paragraph>
                        To the fullest extent permitted by law, Crution Private Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or inability to access them.
                    </Paragraph>

                    <Title level={3}>9. Indemnification</Title>
                    <Paragraph>
                        You agree to indemnify and hold harmless FindMenu and its affiliates from any claims, losses, liabilities, damages, costs, or expenses (including reasonable attorneys’ fees) arising out of your use of our services or violation of these Terms and Conditions.
                    </Paragraph>

                    <Title level={3}>10. Changes to Terms</Title>
                    <Paragraph>
                        We reserve the right to modify these Terms and Conditions at any time. We will notify you of significant changes via email or through a notice on our website. Your continued use of our services after such changes constitutes your acceptance of the new terms.
                    </Paragraph>

                    <Title level={3}>11. Governing Law</Title>
                    <Paragraph>
                        These Terms and Conditions shall be governed by and construed in accordance with the laws of the current state Bangalore, Pondicherry, Chennai. Any disputes arising out of or related to these terms shall be resolved in the courts located in Chennai.
                    </Paragraph>

                    <Title level={3}>12. Contact Information</Title>
                    <Paragraph>
                        If you have any questions about these Terms and Conditions, please contact us at: <br />
                        Email: <a href="mailto:support@findmenu.in">support@findmenu.in</a>
                    </Paragraph>
                </Col>
            </Row>
        </Layout>
    );
};

export default TermsAndConditions;
