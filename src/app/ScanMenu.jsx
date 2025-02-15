import { Layout, Row, Button, Image } from "antd";
const { Header, Content } = Layout;
import { imageUrl } from "../utils/common.js";
import { useState } from "react";
import ScanQRCode from "./ScanQRCode.jsx";

const ScanMenu = () => {
  const [showScan, setShowScan] = useState(false);

  const handleScan = () => {
    setShowScan(true);
  };

  return (
    <Layout
      style={{
        minHeight: "auto",
        maxWidth: "550px",
        minWidth: "320px",
        margin: "0px auto",
        background: "#efefef",
      }}
    >
      <Header
        className="header"
        style={{
          backgroundImage: `url(${imageUrl("images/bg.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 180,
        }}
      >
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <Image
            src={imageUrl("images/logo.png")}
            width={120}
            height={120}
            preview={false}
            alt="Logo"
            style={{
              borderRadius: "50%",
            }}
          />
        </div>
      </Header>
      <Content
        style={{
          padding: "10px",
          zIndex: 100,
          height: "auto",
          backgroundColor: "#fff",
        }}
      >
        <Content>
          <Row justify="center">
            <div
              className="image-container"
              style={{ textAlign: "center", marginTop: 5, width: 300 }}
            >
              <div
                className="scan-container"
                style={{
                  border: "3px solid black",
                  minWidth: 300,
                  maxWidth: 550,
                  height: 300,
                  margin: "0px auto",
                  marginTop: 20,
                }}
              >
                {showScan && <ScanQRCode />}
              </div>
              <div className="button-container" style={{ marginTop: 40 }}>
                <Button onClick={handleScan}>Scan QR Code</Button>
                <Button onClick={() => setShowScan(false)}>Cancel</Button>
              </div>

              <p style={{ marginTop: 20 }}>
                <a href="http://findmenu.in">FindMenu.in</a>
              </p>
              <p style={{ marginTop: 20 }}>©2025 FindMenu</p>
            </div>
          </Row>
        </Content>
      </Content>
    </Layout>
  );
};

export default ScanMenu;
