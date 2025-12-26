import { Form, Input, InputNumber, DatePicker, Switch } from "antd";
import dayjs from "dayjs";

/**
 * Render a custom field based on its type
 * @param {Object} field - The field configuration
 * @param {string} field.id - Field ID
 * @param {string} field.field_name - Field name (used as form field name)
 * @param {string} field.field_label - Field label (displayed to user)
 * @param {string} field.field_type - Field type (text, number, date, boolean)
 * @param {boolean} field.is_required - Whether field is required
 * @param {string} field.default_value - Default value
 * @returns {JSX.Element} Form.Item with appropriate input component
 */
export function renderCustomField(field) {
  const fieldName = `custom_fields.${field.field_name}`;
  const rules = field.is_required 
    ? [{ required: true, message: `Please enter ${field.field_label}` }]
    : [];

  switch (field.field_type) {
    case 'number':
      return (
        <Form.Item
          key={field.id}
          name={fieldName}
          label={field.field_label}
          rules={rules}
          initialValue={field.default_value ? parseFloat(field.default_value) : undefined}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            placeholder={`Enter ${field.field_label}`} 
          />
        </Form.Item>
      );

    case 'date':
      return (
        <Form.Item
          key={field.id}
          name={fieldName}
          label={field.field_label}
          rules={rules}
          getValueProps={(value) => {
            if (!value) return { value: undefined };
            return { value: typeof value === 'string' ? dayjs(value) : value };
          }}
          normalize={(value) => {
            if (!value) return null;
            return typeof value === 'string' ? value : value.format('YYYY-MM-DD');
          }}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="YYYY-MM-DD" 
          />
        </Form.Item>
      );

    case 'boolean':
      return (
        <Form.Item
          key={field.id}
          name={fieldName}
          label={field.field_label}
          rules={rules}
          valuePropName="checked"
          initialValue={
            field.default_value === '1' || 
            field.default_value === 'true' || 
            field.default_value === true
          }
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
      );

    case 'text':
    default:
      return (
        <Form.Item
          key={field.id}
          name={fieldName}
          label={field.field_label}
          rules={rules}
          initialValue={field.default_value}
        >
          <Input placeholder={`Enter ${field.field_label}`} />
        </Form.Item>
      );
  }
}

/**
 * Parse custom_fields from string to object
 * @param {string|object} customFields - Custom fields data
 * @returns {object} Parsed custom fields object
 */
export function parseCustomFields(customFields) {
  if (!customFields) return {};
  
  if (typeof customFields === 'string') {
    try {
      return JSON.parse(customFields);
    } catch (e) {
      console.error('Error parsing custom_fields:', e);
      return {};
    }
  }
  
  return customFields;
}

/**
 * Prepare custom fields for form submission
 * Filters out empty values and converts to JSON string
 * @param {object} customFieldsValues - Custom fields values from form
 * @returns {string|null} JSON string of custom fields or null if empty
 */
export function prepareCustomFieldsForSubmit(customFieldsValues) {
  if (!customFieldsValues) return null;
  
  const cleanedFields = {};
  
  Object.keys(customFieldsValues).forEach(key => {
    const value = customFieldsValues[key];
    if (value !== undefined && value !== null && value !== '') {
      cleanedFields[key] = value;
    }
  });
  
  if (Object.keys(cleanedFields).length === 0) {
    return null;
  }
  
  return JSON.stringify(cleanedFields);
}

/**
 * Set custom fields values in form
 * @param {object} form - Ant Design form instance
 * @param {string|object} customFields - Custom fields data
 */
export function setCustomFieldsInForm(form, customFields) {
  const parsed = parseCustomFields(customFields);
  
  Object.keys(parsed).forEach(key => {
    form.setFieldValue(`custom_fields.${key}`, parsed[key]);
  });
}
