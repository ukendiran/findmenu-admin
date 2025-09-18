// components/CustomTable.jsx
import React from 'react';
import { Table, Spin, Typography, Button, Space, message } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import Papa from 'papaparse'; // ✅ Correct usage

const { Title } = Typography;

const CustomTable = ({
    title = '',
    columns = [],
    data = [],
    loading = false,
    pagination = { pageSize: 10 },
    rowKey = 'id',
    onEdit,
    onView,
    onDelete,
    enableExport = false,
    exportFileName = 'export.csv',
}) => {
    // Export CSV Handler

    const handleExport = () => {
        if (!data || data.length === 0) {
            message.warning('No data to export');
            return;
        }

        // Remove fields like internal id if needed
        const cleanData = data.map(({ id, ...rest }) => rest);

        // Convert object data to array of arrays (rows)
        const rows = [
            ['My Subscriptions Report'], // custom title row
            [], // empty row
            Object.keys(cleanData[0]), // header row
            ...cleanData.map(obj => Object.values(obj)), // data rows
        ];

        // const rows = [
        //     ['My Subscriptions Report'], // custom title row
        //     [], // empty row
        //     ['Business Name', 'Plan Name', 'Paument ID', 'Start Date', 'End Date', 'Status'],
        //     ...cleanData.map(obj => [
        //         obj.businessName || '',
        //         obj.planName || '',
        //         obj.paymentId || '',
        //         new Date(obj.starts_at).momment('DD-MM-YYYY'),
        //         new Date(obj.ends_at).toLocaleDateString(),
        //         obj.status || '',
        //     ])
        // ];


        const csv = Papa.unparse(rows, { quotes: true });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', exportFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const actionColumn = {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <Space>
                <Button
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => onView && onView(record)}
                />
                <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => onEdit && onEdit(record)}
                />
                <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => onDelete && onDelete(record)}
                />
            </Space>
        ),
    };

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                {title && <Title level={4}>{title}</Title>}
                {enableExport && (
                    <Button icon={<DownloadOutlined />} onClick={handleExport}>
                        Export CSV
                    </Button>
                )}
            </div>

            {loading ? (
                <Spin />
            ) : (
                <Table
                    rowKey={rowKey}
                    columns={[...columns, actionColumn]}
                    dataSource={data}
                    pagination={pagination}
                    bordered
                />
            )}
        </div>
    );
};

export default CustomTable;
