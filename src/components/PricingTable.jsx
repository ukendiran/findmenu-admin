
import { Card, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
    {
        title: "If paid monthly",
        price: "₹250",
        description: "Charged every month\nTotal amount is ₹250",
        isHighlighted: false,
    },
    {
        title: "If paid every 6 months",
        price: "₹200",
        description: "Charged every 6 months\nTotal amount is ₹1200",
        isHighlighted: true,
    },
    {
        title: "If paid annually",
        price: "₹150",
        description: "Charged every 12 months\nTotal amount is ₹1800",
        isHighlighted: false,
    },
];

const PricingTable = () => {
    const navigate = useNavigate()
    return (
        <div style={{ backgroundColor: "#F4F8F8" }}>
            <div style={{ padding: "64px 24px", maxWidth: 1200, margin: "0 auto" }}>
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
                    QR Code Menu Service Prices
                </h2>
                <Row gutter={[16, 16]} justify="center">
                    {pricingPlans.map((plan, index) => (
                        <Col xs={24} sm={8} key={index}>
                            <Card
                                style={{
                                    textAlign: "center",
                                    padding: "1.5rem",
                                    backgroundColor: plan.isHighlighted ? "#074225" : "#fff",
                                    color: plan.isHighlighted ? "#fff" : "#000",
                                    border: plan.isHighlighted ? "2px solid #074225" : "1px solid #d9d9d9",
                                    borderRadius: "12px",
                                }}
                                hoverable
                            >
                                <h3 style={{ fontSize: "18px" }}>{plan.title}</h3>
                                <h1 style={{ fontSize: "36px", margin: "1rem 0" }}>{plan.price}</h1>
                                <p style={{ whiteSpace: "pre-wrap" }}>{plan.description}</p>
                                <p><Button onClick={() => navigate('contact')}>Pay Now</Button></p>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "12px" }}>
                    GST may be applicable
                </p>
            </div>
        </div>
    );
};

export default PricingTable;
