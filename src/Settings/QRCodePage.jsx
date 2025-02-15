import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Input, QRCode, Button, Row, Col, Space } from "antd";
import { SketchPicker } from "react-color";
import apiService from "../services/apiService";

// Using default parameter instead of defaultProps
const QRCodePage = ({ restaurantCode }) => {
  const [qrColor, setQrColor] = useState("#000000");
  const qrCodeRef = useRef(null);
  const url = `${apiService.appUrl}/p/${restaurantCode}`;

  const handleDownloadQRCode = () => {
    const qrCanvas = qrCodeRef.current?.querySelector("canvas");
    if (qrCanvas) {
      const link = document.createElement("a");
      link.href = qrCanvas.toDataURL("image/png");
      link.download = `${restaurantCode}-qrcode.png`;
      link.click();
    }
  };

  const handleColorChange = (color) => {
    setQrColor(color.hex);
  };

  return (
    <Row gutter={[16, 16]} justify="center" style={{ padding: "20px", textAlign: "center" }}>
      <Col xs={24} md={12}>
        <Space direction="vertical" size="middle">
          <div ref={qrCodeRef}>
            <QRCode 
              value={url} 
              color={qrColor}
              bgColor="#ffffff"
              size={200}
              style={{ marginBottom: 16 }}
            />
          </div>
          <Button type="primary" onClick={handleDownloadQRCode}>
            Download QR Code
          </Button>
          <Input
            value={url}
            readOnly
            style={{
              width: "300px",
              height: "50px",
              fontSize: "16px"
            }}
          />
        </Space>
      </Col>
      <Col xs={24} md={12}>
        <SketchPicker 
          color={qrColor} 
          onChangeComplete={handleColorChange}
          styles={{
            default: {
              picker: {
                margin: '0 auto'
              }
            }
          }}
        />
      </Col>
    </Row>
  );
};
QRCodePage.propTypes = {
  restaurantCode: PropTypes.string,
};

export default QRCodePage;