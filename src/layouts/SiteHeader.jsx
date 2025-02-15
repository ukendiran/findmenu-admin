import { Layout, Menu, Row, Col, Image } from "antd";
import { Link } from "react-router-dom";

const logoImage = "../../images/logo-png.png"; // Update this to the correct path
const { Header } = Layout;

const SiteHeader = () => {
  const menuItems = [
    {
      key: "home",
      label: <Link to="/">Home</Link>,
    },
    // {
    //   key: "about",
    //   label: <Link to="/about">About</Link>,
    // },
    // {
    //   key: "services",
    //   label: "Services",
    //   children: [
    //     {
    //       key: "service-1",
    //       label: <Link to="/services/service-1">Service 1</Link>,
    //     },
    //     {
    //       key: "service-2",
    //       label: <Link to="/services/service-2">Service 2</Link>,
    //     },
    //     {
    //       key: "service-3",
    //       label: <Link to="/services/service-3">Service 3</Link>,
    //     },
    //     {
    //       key: "service-4",
    //       label: <Link to="/services/service-4">Service 4</Link>,
    //     },
    //   ],
    // },
    {
      key: "contact",
      label: <Link to="/contact">Contact</Link>,
    },
    {
      key: "login",
      label: <Link to="/login">Login</Link>,
    },
  ];
  const currentPath = location.pathname.split("/")[1] || "home";

  return (
    <Header
      className="site-header"
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
        height: 100,
      }}
    >
      <Row
        justify="space-between"
        align="middle"
        style={{
          height: "100%",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Col span={8}>
          <a href="/">
            <Image src={logoImage} preview={false} width={100} />
          </a>
        </Col>

        {/* Desktop Menu */}
        <Col
          span={16}
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Menu
            mode="horizontal"
            items={menuItems}
            defaultSelectedKeys={currentPath}
            style={{
              width: "100%",
              justifyContent: "flex-end",
            }}
          />
        </Col>
      </Row>
    </Header>
  );
};

export default SiteHeader;
