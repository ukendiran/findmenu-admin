import { Row, Col, Typography } from "antd";

const { Title } = Typography;
export default function Benefits() {
  const items = [
    {
      key: 1,
      image: "reduced-paper.png",
      title: "Reduced paper & plastic waste",
    },
    {
      key: 2,
      image: "contactless.png",
      title: "Safe & contactless experience",
    },
    {
      key: 3,
      image: "easy-and-fast.png",
      title: "Easy and fast menu setup",
    },
    {
      key: 4,
      image: "make-live.png",
      title: "Make live updates on your menu",
    },
    {
      key: 5,
      image: "daily-menu.png",
      title: "Daily menu data analytics",
    },
    {
      key: 6,
      image: "ready-to-use.png",
      title: "Ready-to-use qr menu",
    },
    {
      key: 7,
      image: "multilang.png",
      title: "Multi language menu",
    },
    {
      key: 8,
      image: "dynamic-qr.png",
      title: "Dynamic qr menu",
    },
  ];

  return (
    <div
      className="benefits-section"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="container" style={{ textAlign: "center" }}>
        <Title style={{ margin: "60px 0px" }} level={2}>
          Why should you choose a QR menu?
        </Title>
        <Row gutter={[16, 16]} justify="center">
          {items.map((item) => (
            <Col key={item.key} xs={24} sm={12} md={6}>
              <div className="custom-card" style={{ margin: 20 }}>
                <div className="image-container">
                  <img
                    alt={item.title}
                    src={`images/${item.image}`}
                    className="hover-image"
                    style={{ maxWidth: 300 }}
                  />
                </div>
                <h3
                  className="content"
                  style={{ padding: 20, textAlign: "center", fontSize: 18 }}
                >
                  {item.title}
                </h3>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
