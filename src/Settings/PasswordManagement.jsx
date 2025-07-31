import { useState } from "react";
import PropTypes from "prop-types";
import {
    Button,
    Col,
    Form,
    Row,
    Spin,
    Input,
    notification,
} from "antd";

import apiService from "../services/apiService";
import { extractErrorMessages } from "../utils/errorHelper";

export default function PasswordManagement({ business }) {
    const [notificationApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("old_password", values.old_password);
            formData.append("new_password", values.new_password);
            formData.append("confirm_password", values.confirm_password);

            const response = await apiService.post(`/business/password/${business.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                notificationApi.success({
                    message: "Password Changed",
                    description: "Password changed successfully.",
                });
                form.resetFields();
            } else {
                throw new Error(response.data.message || "Password change failed");
            }
        } catch (error) {
            notificationApi.error({
                message: "Update Failed",
                description: extractErrorMessages(error, "Failed to update password"),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label="Old Password"
                            name="old_password"
                            rules={[{ required: true, message: "Please enter your current password" }]}
                        >
                            <Input.Password placeholder="Enter old password" />
                        </Form.Item>

                        <Form.Item
                            label="New Password"
                            name="new_password"
                            rules={[
                                { required: true, message: "Please enter a new password" },
                                { min: 6, message: "Password must be at least 6 characters" },
                            ]}
                        >
                            <Input.Password placeholder="Enter new password" />
                        </Form.Item>

                        <Form.Item
                            label="Confirm New Password"
                            name="confirm_password"
                            dependencies={["new_password"]}
                            rules={[
                                { required: true, message: "Please confirm the new password" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("new_password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject("Passwords do not match");
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Re-enter new password" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="center" style={{ marginTop: 24 }}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            size="large"
                        >
                            Change Password
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

PasswordManagement.propTypes = {
    business: PropTypes.object.isRequired,
};
