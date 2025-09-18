import { useEffect, useState } from "react";
import apiService from "../services/apiService";
import CustomTable from "../components/CustomTable";
import moment from 'moment';
import { Tag } from "antd";


export const SubscriptionList = ({ business }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false); // ✅ Fix: loading should be boolean
    useEffect(() => {
        fetchSubscriptions();
    }, [business]);

    const columns = [
        {
            title: "Plan Name",
            dataIndex: "plan",
            key: "plan.name",
            render: (plan) => plan?.name || "N/A",
        },
        {
            title: "Status",
            dataIndex: "ends_at",
            key: "status",
            render: (endsAt, record) => {
                const now = moment();
                const end = moment(endsAt);
                let color, label;

                if (now.isAfter(end)) {
                    // Expired status - past end date
                    color = "red";
                    label = "Expired";
                } else if (record.status) {
                    // Active status - within date range and status flag is truthy
                    color = "green";
                    label = "Active";
                } else {
                    // Default processing state
                    color = "blue";
                    label = "Processing";
                }

                return <Tag color={color}>{label}</Tag>;
            },
            sorter: (a, b) => {
                const getStatusCode = (record) => {
                    const now = moment();
                    const end = moment(record.ends_at);
                    if (now.isAfter(end)) {
                        return 0; // Expired
                    } else if (record.status) {
                        return 1; // Active
                    } else {
                        return 2; // Processing
                    }
                };
                return getStatusCode(a) - getStatusCode(b);
            }
        },
        {
            title: "Start Date",
            dataIndex: "starts_at",
            key: "starts_at",
            render: (date) =>
                date ? moment(date).format("DD-MM-YYYY") : "Not Available",
            sorter: (a, b) => new Date(a.starts_at) - new Date(b.starts_at),
        },
        {
            title: "End Date",
            dataIndex: "ends_at",
            key: "ends_at",
            render: (date) =>
                date ? moment(date).format("DD-MM-YYYY") : "Not Available",
            sorter: (a, b) => new Date(a.ends_at) - new Date(b.ends_at),
        },
    ];

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const subs = await apiService.get('subscriptions', { businessId: business.id });
            if (subs.data.success) {
                setSubscriptions(subs.data.data);
            } else {
                setSubscriptions([]);
            }
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            setSubscriptions([]);
        } finally {
            setLoading(false);
        }
    };

    // Optional action handlers
    const handleView = (record) => {
        console.log('View clicked:', record);
    };

    const handleEdit = (record) => {
        console.log('Edit clicked:', record);
    };

    const handleDelete = (record) => {
        console.log('Delete clicked:', record);
    };

    return (
        <div style={{ marginTop: 20 }}>
            <CustomTable
                title="Subscriptions"
                columns={columns}
                data={subscriptions}
                loading={loading}
                pagination={{ pageSize: 5 }}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                enableExport={true}
                exportFileName="subscriptions.csv"
            />
        </div>
    );
};
