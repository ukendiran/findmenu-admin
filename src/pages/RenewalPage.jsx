// RenewalPage.jsx
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useLocation } from 'react-router-dom';

export const RenewalPage = () => {
    const location = useLocation();
    const fromPath = location.state?.from?.pathname || '/dashboard';
    return (
        <div className="renewal-container">

            <div className="text-center" style={{ padding: '40px 16px' }}>
                <Result
                    icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '72px' }} />}
                    title="No Active Subscription"
                    subTitle="Please renew your subscription to access the dashboard features."
                    extra={
                        <Button type="primary" size="large">
                            Renew Subscription
                        </Button>
                    }
                />
            </div>
        </div>
    );
};