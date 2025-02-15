import { Card, Tag } from "antd";
import PropTypes from "prop-types";
import "./SubCatCard.css"; // Ensure CSS file exists

const SubCatCard = ({ subCategory, selectedCategory, onSubCategorySelect }) => {
  const backgroundImageUrl = subCategory?.image || null;
  const handleClick = () => {
    onSubCategorySelect(subCategory);
  };
  return (
    <div style={{ margin: "10px 0px" }}>
      <Card
        bordered={false}
        onClick={handleClick}
        className="category-card"
        style={{
          backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#bbb",
          height: "200px",
          width: "100%",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <h1
          style={{
            textShadow: "0 2px 3px rgba(0, 0, 0, 0.46)",
            width: "100%",
          }}
        >
          {subCategory?.name?.toUpperCase()}
        </h1>
        {Number(subCategory?.isAvailable) === 2 || Number(selectedCategory?.isAvailable) === 2 && (
          <Tag
            style={{
            }}
            color="red"
          >
            Currently not available
          </Tag>
        )}
      </Card>
    </div>
  );
};

SubCatCard.propTypes = {
  subCategory: PropTypes.any,
  selectedCategory: PropTypes.any,
  onSubCategorySelect: PropTypes.func.isRequired,
};

export default SubCatCard;