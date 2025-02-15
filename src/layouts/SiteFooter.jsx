import { Layout, Menu, Row, Col, Typography, QRCode, Image, Space } from "antd";
import { useNavigate } from "react-router-dom";

const logoImage = "../../images/logo-png.png"; // Update this to the correct path
const { Footer } = Layout;
const { Title, Paragraph } = Typography;

const Website = () => {
  const navigate = useNavigate();
  const navigationItems = [
    {
      key: "home",
      label: "Home",
      link: "",
    },
    {
      key: "about",
      label: "About",
      link: "about",
    },
    {
      key: "contact",
      label: "Contact",
      link: "contact",
    },

  ];
  const menuUrl = "https://findmenu.in/";
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Footer style={{ padding: "60px 0px", textAlign: "left" }}>
        <Row gutter={[48, 32]} style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "#fff" }}>
              FindMenu
            </Title>
            <a href="">
              <Image
                src={logoImage}
                preview={false}
                width={100}
                style={{ marginBottom: 20 }}
              />
            </a>
            <Paragraph style={{ color: "rgba(255,255,255,0.65)" }}>
              Find Menu: Contactless & Eco-Friendly Menu for Restaurants and Hotels
            </Paragraph>
            {/* Links below the logo */}
            <Paragraph>
              <Space>
                <a
                  onClick={() => navigate("terms-and-conditions")}
                  style={{ color: "#fff", display: "block" }}
                >
                  Terms and Conditions
                </a>
                <span style={{ color: "#fff" }}> | </span>
                <a
                  onClick={() => navigate("privacy-policy")}
                  style={{ color: "#fff", display: "block" }}
                >
                  Privacy Policy
                </a>
                <span style={{ color: "#fff" }}> | </span>
                <a
                  onClick={() => navigate("return-policy")}
                  style={{ color: "#fff", display: "block" }}
                >
                  Return Policy
                </a>
              </Space>
            </Paragraph>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Title level={4} style={{ color: "#fff" }}>
              Quick Links
            </Title>
            <Menu
              mode="vertical"
              theme="dark"
              style={{ background: "transparent" }}
              items={navigationItems.map((item) => ({
                key: item.key,
                label: item.label,
                onClick: () => navigate(item.link),
              }))}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#fff" }}>
              Contact
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.65)" }}>
              +91 9962181994
            </Paragraph>
            <Paragraph style={{ color: "rgba(255,255,255,0.65)" }}>
            Support@findmenu.in 
            </Paragraph>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#fff" }}>
              Scan Us
            </Title>
            <div>
              <QRCode
                value={menuUrl}
                size={100}
                color={"#9AB2C2"}
                style={{ padding: 0, margin: 0 }}
              />
            </div>
          </Col>
        </Row>
      </Footer>

      <Row justify="center" style={{ backgroundColor: "#0a2618", paddingTop: 15 }}>
        <Paragraph style={{ color: "rgba(255,255,255,0.45)" }}>
          &copy; {currentYear} FindMenu. All rights reserved.
        </Paragraph>
      </Row>
    </>
  );
};

export default Website;
