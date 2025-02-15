import { Button, Rate, Typography } from "antd";
import PropTypes from "prop-types";
import { EditOutlined } from "@ant-design/icons";

const RatingComponent = ({ restaurantConfig }) => {
    const handleReview = () => {
        if (restaurantConfig.googleReviewLink !== null && restaurantConfig.googleReviewLink !== "")
            window.location.href = restaurantConfig.googleReviewLink;
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap", // Allow wrapping for smaller screens
                gap: "8px",
                width: "100%",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {restaurantConfig.reviewStatus === 1 && <div>
                    <Typography.Text strong style={{ fontSize: "1.2rem" }}>
                        {restaurantConfig.stars}
                    </Typography.Text>
                    <Rate
                        allowHalf
                        defaultValue={4.9}
                        disabled
                        style={{ color: "#faad14", fontSize: 10 }}
                    />
                    <Typography.Text style={{ fontSize: 16, color: "#888" }}>
                        {restaurantConfig.reviewCount} reviews
                    </Typography.Text>
                </div>}

            </div>

            {restaurantConfig.googleReviewStatus === 1 && (
                <Button
                    style={{
                        fontSize: 10,
                        padding: "5px 10px",
                        fontFamily: "Arial, sans-serif",
                        border: "1px solid #8ab4f8",
                    }}
                    onClick={handleReview}
                    type="primary"
                    icon={<EditOutlined />}
                >
                    Write a review
                </Button>
            )}
        </div>
    );
};

RatingComponent.propTypes = {
    restaurantConfig: PropTypes.any,

};

export default RatingComponent;