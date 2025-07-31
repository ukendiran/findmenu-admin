import { useEffect, useState } from "react";
import { Form, Select, Spin } from "antd";
import apiService from '../services/apiService';

const BusinessTypeSelect = ({ form }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiService.get("/business/types").then((res) => {
            const types = res.data || [];
            setOptions(types.map(type => ({ label: type, value: type })));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    // Ensure only 1 tag selected
    const handleChange = (value) => {
        if (Array.isArray(value)) {
            const last = value[value.length - 1];
            form.setFieldsValue({ type: [last] });
        }
    };

    return (
        <Form.Item
            label="Business Type"
            name="type"
            rules={[{ required: true, message: "Please select or enter business type" }]}
        >
            <Select
                mode="tags"
                placeholder="Select or enter business type"
                loading={loading}
                tokenSeparators={[","]}
                onChange={handleChange}
                value={form.getFieldValue("type")}
                options={options}
            />
        </Form.Item>
    );
};

export default BusinessTypeSelect;
