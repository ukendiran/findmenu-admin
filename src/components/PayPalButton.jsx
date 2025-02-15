import { PayPalButtons } from "@paypal/react-paypal-js";
import { message } from "antd";

const PayPalButton = () => {
    return (
        <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: "10.00", // Set the amount dynamically
                            },
                        },
                    ],
                });
            }}
            onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                    message.success(`Transaction completed by ${details.payer.name.given_name}`);
                });
            }}
            onError={(err) => {
                console.error(err);
                message.error("Payment failed. Please try again.");
            }}
        />
    );
};

export default PayPalButton;
