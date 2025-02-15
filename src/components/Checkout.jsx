import { useState } from "react";
import { Button, Modal } from "antd";
import PayPalButton from "./PayPalButton";

const Checkout = () => {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <Button type="primary" onClick={() => setVisible(true)}>Pay with PayPal</Button>
            <Modal title="Complete Payment" open={visible} onCancel={() => setVisible(false)} footer={null}>
                <PayPalButton />
            </Modal>
        </div>
    );
};

export default Checkout;
