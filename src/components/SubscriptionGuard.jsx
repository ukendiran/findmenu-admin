import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const SubscriptionGuard = () => {
    const location = useLocation();
    const isSubscribed = useSelector((state) => state.auth.isSubscribed); // Adjust based on your store

    console.log(isSubscribed)

    if (!isSubscribed) {
        return <Navigate to="/subscription-error" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
