import { useState } from 'react';
import {
  Form,
  Input,
  Upload,
  Button,
  Select,
  TimePicker,
  Switch,
  Rate,
  Divider,
  message
} from 'antd';
import {
  SaveOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';

import apiService from '../../services/apiService';

const { TextArea } = Input;
const { Option } = Select;

const RestaurantProfile = () => {
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const cuisineTypes = [
    'Italian', 'Chinese', 'Mexican', 'Indian',
    'Japanese', 'French', 'Mediterranean', 'American'
  ];

  const handleImageUpload = ({ file }) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    }

    // Use URL.createObjectURL for more reliable image loading
    setProfileImage(URL.createObjectURL(file));
    return true;
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();

    // Append form fields
    formData.append('name', values.name);
    formData.append('cuisine', values.cuisine);
    formData.append('description', values.description);
    formData.append('openTime', values.openTime.format('HH:mm'));
    formData.append('closeTime', values.closeTime.format('HH:mm'));
    formData.append('delivery', values.delivery);
    formData.append('rating', values.rating);

    // Append profile image if exists
    if (profileImage) {
      // Fetch blob from URL

      const response = await fetch(profileImage);
      const blob = await response.blob();
      formData.append('profileImage', blob, 'profile.jpg');
    }


    try {
      const response = apiService.post(`restaurant/updateProfile`, formData);
      console.log(response)
    } catch (error) {
      console.log(error)
      message.error('An error occurred while saving the profile');
    }


    // try {
    //   const response = await fetch('http://your-api-endpoint.com/save_restaurant.php', {
    //     method: 'POST',
    //     body: formData
    //   });

    //   const result = await response.json();
    //   if (result.success) {
    //     message.success('Restaurant profile saved successfully');
    //     setIsEditing(false);
    //   } else {
    //     message.error(result.message || 'Failed to save profile');
    //   }
    // } catch (error) {
    //   message.error('An error occurred while saving the profile');
    // }


  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <div className="restaurant-profile max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurant Profile</h1>
        <Button
          icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => {
            if (isEditing) {
              form.submit();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={!isEditing}
      >
        <div className="flex space-x-6 mb-6">
          <div className="w-1/3">
            <Upload
              name="profileImage"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageUpload}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Restaurant"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>

          {/* Rest of the component remains the same */}
          <div className="w-2/3 space-y-4">
            <Form.Item
              name="name"
              label="Restaurant Name"
              rules={[{ required: true, message: 'Please enter restaurant name' }]}
            >
              <Input placeholder="Enter restaurant name" />
            </Form.Item>

            <Form.Item
              name="cuisine"
              label="Cuisine Type"
              rules={[{ required: true, message: 'Select cuisine type' }]}
            >
              <Select placeholder="Select cuisine type">
                {cuisineTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>

            <div className="flex space-x-4">
              <Form.Item
                name="openTime"
                label="Opens"
                className="w-1/2"
                rules={[{ required: true, message: 'Select opening time' }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>

              <Form.Item
                name="closeTime"
                label="Closes"
                className="w-1/2"
                rules={[{ required: true, message: 'Select closing time' }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </div>
          </div>
        </div>

        <Divider />

        <div className="space-y-4">
          <Form.Item name="description" label="Restaurant Description">
            <TextArea
              rows={4}
              placeholder="Tell us about your restaurant"
            />
          </Form.Item>

          <div className="flex justify-between items-center">
            <Form.Item
              name="delivery"
              label="Delivery Available"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item name="rating" label="Restaurant Rating">
              <Rate allowHalf disabled={!isEditing} />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default RestaurantProfile;