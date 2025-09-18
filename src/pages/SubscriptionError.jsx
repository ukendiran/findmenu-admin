// SubscriptionError.jsx
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

export const SubscriptionError = () => {
    const location = useLocation();
    const fromPath = location.state?.from?.pathname || '/dashboard';
    const navigate = useNavigate();

    const handleRenew = () => {
        navigate('/renew-subscription');
    }
    return (
        <div className="renewal-container">

            <div className="text-center" style={{ padding: '40px 16px' }}>
                <Result
                    icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '72px' }} />}
                    title="No Active Subscription"
                    subTitle="Please renew your subscription to access the dashboard features."
                    extra={
                        <Button type="primary" size="large" onClick={handleRenew}>
                            Renew Subscription
                        </Button>
                    }
                />
            </div>
        </div>
    );
};