import React from "react";
import { Button, Input, QRCode, Segmented, Space } from "antd";

import { imageUrl } from "../utils/common";
function doDownload(url, fileName) {
  const a = document.createElement("a");
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
const downloadCanvasQRCode = () => {
  const canvas = document.getElementById("myqrcode")?.querySelector("canvas");
  if (canvas) {
    const url = canvas.toDataURL();
    doDownload(url, "QRCode.png");
  }
};
const downloadSvgQRCode = () => {
  const svg = document.getElementById("myqrcode")?.querySelector("svg");
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  doDownload(url, "QRCode.svg");
};
const GenerateQR = () => {
  const [renderType, setRenderType] = React.useState("canvas");
  const [text, setText] = React.useState("https://findmenu.in/");
  return (
    <div style={{ margin: "0px auto", width: "500px" }}>
      <Space id="myqrcode" direction="vertical">
        <Segmented
          options={["canvas", "svg"]}
          value={renderType}
          onChange={setRenderType}
        />
        <Input
          placeholder="-"
          maxLength={60}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div>
          <QRCode
            type={renderType}
            value={text}
            bgColor="#fff"
            style={{
              marginBottom: 16,
            }}
            icon={imageUrl("images/logo-svg.svg")}
          />
          <Button
            type="primary"
            onClick={
              renderType === "canvas" ? downloadCanvasQRCode : downloadSvgQRCode
            }
          >
            Download
          </Button>
        </div>
      </Space>
    </div>
  );
};
export default GenerateQR;
