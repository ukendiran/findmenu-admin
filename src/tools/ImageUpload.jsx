import  { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import apiService from "../services/apiService";

const ImageUpload = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    fetch(`${apiService.apiUrl}/upload.php`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          message.success("Image uploaded successfully!");
        } else {
          message.error(data.message || "Upload failed!");
        }
      })
      .catch(() => {
        message.error("Upload failed!");
      });

    // Prevent default upload behavior
    return false;
  };

  return (
    <Upload
      customRequest={({ file }) => handleUpload(file)}
      onChange={handleChange}
      fileList={fileList}
      listType="picture"
    >
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};

export default ImageUpload;
