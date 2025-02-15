import PropTypes from "prop-types";
import { FloatButton } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const WhatsAppButton = ({ phoneNumber }) => {
    // const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    const [whatsappLink, setWhatsappLink] = useState('')
    const onClick = () => {
        window.location.href = whatsappLink
    }

    useEffect(() => {
        if (phoneNumber) {
            const cleanedPhoneNumber = phoneNumber.replace(/\s+/g, "");
            setWhatsappLink(`https://wa.me/${cleanedPhoneNumber}`)
        } else {

            setWhatsappLink(`https://wa.me/${phoneNumber}`)
        }
    },[])


    
    return (

        <FloatButton
            icon={<WhatsAppOutlined />}
            type="primary"
            style={{
                position: "fixed",
                right: "5%",
                bottom: "100px",
                zIndex: 10000,

            }}
            onClick={onClick}
        />

    );
};
WhatsAppButton.propTypes = {
    phoneNumber: PropTypes.string,
    message: PropTypes.string,
};

export default WhatsAppButton;

