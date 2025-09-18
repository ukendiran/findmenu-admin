import { SubscriptionList } from "../Accounts/SubscriptionList";
import { useSelector } from "react-redux";


export default function Subscriptions() {
  const business = useSelector((state) => state.auth.business);

  return (
    <div>
      <SubscriptionList business={business} />
    </div>
  );
}
