import { ArrowLeftOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import PropTypes from 'prop-types';

const NavigationButton = ({ onBack }) => {
    return (
        <FloatButton
            icon={<ArrowLeftOutlined />}
            type="primary"
            style={{
                position: "fixed",
                right: "5%",
                top: "100px",
                zIndex: 10000,
            }}
            onClick={onBack}
        />
    );
};
NavigationButton.propTypes = {
    onBack: PropTypes.func.isRequired,
};

export default NavigationButton;

