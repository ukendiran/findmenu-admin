import { Scanner } from "@yudiel/react-qr-scanner";

const ScanQRCode = () => {
  const handleScan = (data) => {
    if (data) {
      console.log("QR Code Data:", data);

      window.location.href = data[0].rawValue;
    }
  };

  // const handleError = (err) => {
  //   console.error("QR Scanner Error:", err);
  // };

  return (
    <div>
      <Scanner
        style={{ width: "300px", height: "300px" }}
        onScan={(result) => handleScan(result)}
      />
      ;<p>Align the QR code within the scanner box.</p>
    </div>
  );
};

export default ScanQRCode;
