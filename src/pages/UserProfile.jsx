import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Avatar, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import apiService from "../services/apiService";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const token = useSelector((state) => state.auth.token);
  const user = token.data;
    const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await apiService.get(`/users/${user.id}`);
      if (response.data) {
        setUserData(response.data[0]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const onFinish = (values) => {
    const profileData = {
      ...values,
      image: imageUrl,
    };

    apiService
      .put(`/users/${user.id}`, profileData)
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          notification.success({
            message: "Profile Updated",
            description: "Profile updated Successfully.",
          });
        }
      });
  };

  const onUploadChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    if (file.status === "done") {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file.originFileObj);
      notification.success({
        message: "Account Settings Updated",
        description: "Account Settings updated Successfully.",
      });
    } else if (file.status === "error") {
      notification.error({
        message: "Error",
        description: "Account Settings updated Successfully.",
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Profile Page</h2>
      {!loading && (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Name"
            initialValue={userData?.name}
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item name="profileImage" label="Profile Image">
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false} // Disable auto-upload
              onChange={onUploadChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <Avatar size={100} src={imageUrl} />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default ProfilePage;
