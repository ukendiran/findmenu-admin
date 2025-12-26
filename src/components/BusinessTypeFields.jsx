import { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  Table,
  Space,
  App,
  Modal,
  Tooltip,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import apiService from "../services/apiService";
import { extractErrorMessages } from "../utils/errorHelper";

const { Option } = Select;

const BusinessTypeFields = ({ businessTypeId, onFieldsUpdated }) => {
  const { notification: notificationApi } = App.useApp();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);

  const fetchFields = useCallback(async () => {
    if (!businessTypeId) return;

    try {
      setLoading(true);
      const response = await apiService.get(
        `/business-types/${businessTypeId}/fields`
      );
      if (response.data?.success && response.data?.data) {
        const dataWithKeys = response.data.data.map((item, index) => ({
          ...item,
          key: item.id || index,
        }));
        setData(dataWithKeys);
      } else {
        setData([]);
      }
    } catch (error) {
      // Ignore if request was canceled
      if (error.code === 'ERR_CANCELED' || error.message === 'canceled') {
        return;
      }
      console.error("Error fetching fields:", error);
      notificationApi.error({
        message: "Fetch Error",
        description: extractErrorMessages(error, "Failed to load fields"),
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [businessTypeId, notificationApi]);

  useEffect(() => {
    fetchFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessTypeId]);

  const showModal = (field = null) => {
    setCurrentField(field);
    if (field) {
      form.setFieldsValue(field);
    } else {
      form.resetFields();
      // Set default order to be after the last field
      const maxOrder = data.length > 0 ? Math.max(...data.map((f) => f.order || 0)) : -1;
      form.setFieldsValue({ order: maxOrder + 1, is_required: false });
    }
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentField(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      if (currentField?.id) {
        await apiService.put(`/business-type-fields/${currentField.id}`, values);
        notificationApi.success({
          message: "Updated",
          description: "Field updated successfully!",
        });
      } else {
        await apiService.post(
          `/business-types/${businessTypeId}/fields`,
          values
        );
        notificationApi.success({
          message: "Created",
          description: "Field created successfully!",
        });
      }
      fetchFields();
      if (onFieldsUpdated) {
        onFieldsUpdated();
      }
      handleModalCancel();
    } catch (error) {
      notificationApi.error({
        message: "Save Failed",
        description: extractErrorMessages(error, "Unable to save field"),
      });
    }
  };

  const handleDelete = (field) => {
    setFieldToDelete(field);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!fieldToDelete) return;

    try {
      await apiService.delete(`/business-type-fields/${fieldToDelete.id}`);
      notificationApi.success({
        message: "Deleted",
        description: "Field deleted successfully!",
      });
      fetchFields();
      if (onFieldsUpdated) {
        onFieldsUpdated();
      }
    } catch (error) {
      notificationApi.error({
        message: "Delete Failed",
        description: extractErrorMessages(error, "Unable to delete field"),
      });
    } finally {
      setIsDeleteModalOpen(false);
      setFieldToDelete(null);
    }
  };

  const handleMoveOrder = async (field, direction) => {
    const currentIndex = data.findIndex((f) => f.id === field.id);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= data.length) return;

    const targetField = data[newIndex];
    const newOrder = targetField.order;
    const oldOrder = field.order;

    try {
      // Swap orders
      await apiService.put(`/business-type-fields/${field.id}`, {
        order: newOrder,
      });
      await apiService.put(`/business-type-fields/${targetField.id}`, {
        order: oldOrder,
      });
      fetchFields();
      if (onFieldsUpdated) {
        onFieldsUpdated();
      }
    } catch (error) {
      notificationApi.error({
        message: "Move Failed",
        description: extractErrorMessages(error, "Unable to reorder field"),
      });
    }
  };

  const columns = [
    {
      title: "Order",
      key: "order",
      width: 80,
      render: (_, record, index) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<ArrowUpOutlined />}
            disabled={index === 0}
            onClick={() => handleMoveOrder(record, "up")}
          />
          <Button
            type="link"
            size="small"
            icon={<ArrowDownOutlined />}
            disabled={index === data.length - 1}
            onClick={() => handleMoveOrder(record, "down")}
          />
        </Space>
      ),
    },
    {
      title: "Field Name",
      dataIndex: "field_name",
      key: "field_name",
    },
    {
      title: "Field Label",
      dataIndex: "field_label",
      key: "field_label",
    },
    {
      title: "Type",
      dataIndex: "field_type",
      key: "field_type",
      render: (type) => (
        <span style={{ textTransform: "capitalize" }}>{type}</span>
      ),
    },
    {
      title: "Required",
      dataIndex: "is_required",
      key: "is_required",
      render: (val) => (val ? "Yes" : "No"),
    },
    {
      title: "Default Value",
      dataIndex: "default_value",
      key: "default_value",
      render: (val) => val || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add Field
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        size="small"
      />

      <Modal
        title={currentField ? "Edit Field" : "Add Field"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="field_name"
            label="Field Name"
            rules={[
              { required: true, message: "Please enter field name" },
              {
                pattern: /^[a-z][a-z0-9_]*$/,
                message:
                  "Field name must start with a letter and contain only lowercase letters, numbers, and underscores",
              },
            ]}
            tooltip="Used as the key in custom_fields JSON (e.g., 'cuisine_type')"
          >
            <Input placeholder="e.g., cuisine_type" disabled={!!currentField} />
          </Form.Item>

          <Form.Item
            name="field_label"
            label="Field Label"
            rules={[{ required: true, message: "Please enter field label" }]}
            tooltip="Display name shown to users (e.g., 'Cuisine Type')"
          >
            <Input placeholder="e.g., Cuisine Type" />
          </Form.Item>

          <Form.Item
            name="field_type"
            label="Field Type"
            rules={[{ required: true, message: "Please select field type" }]}
          >
            <Select placeholder="Select field type">
              <Option value="text">Text</Option>
              <Option value="number">Number</Option>
              <Option value="date">Date</Option>
              <Option value="boolean">Boolean</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="is_required"
            label="Required"
            valuePropName="checked"
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>

          <Form.Item
            name="default_value"
            label="Default Value"
          >
            <Input placeholder="Optional default value" />
          </Form.Item>

          <Form.Item
            name="order"
            label="Order"
            rules={[{ required: true, message: "Please enter order" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {currentField ? "Update" : "Create"}
              </Button>
              <Button onClick={handleModalCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Delete Field"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setFieldToDelete(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete the field "{fieldToDelete?.field_label}"?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

BusinessTypeFields.propTypes = {
  businessTypeId: PropTypes.number.isRequired,
  onFieldsUpdated: PropTypes.func,
};

export default BusinessTypeFields;
