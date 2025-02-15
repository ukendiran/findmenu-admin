import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Restaurant.css"; // Optional: to manage custom styles
import SearchSection from "./SearchSection";
import { Button, Skeleton } from "antd";
import BusinessInfo from "./components/BusinessInfo";
import SubCatCard from "./components/SubCatCard";
import ItemList from "./components/ItemList";
import NavigationButton from "./components/NavigationButton";
import WhatsAppButton from "./components/WhatsAppButton";

function Restaurant({ restaurantData, restaurantConfig, mainCategory, loading }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showItems, setShowItems] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState(true);
  const [subCategory, setSubCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [activeButtonId, setActiveButtonId] = useState(null);

  useEffect(() => {
    console.log(selectedCategory)
    if (mainCategory && mainCategory.length > 0) {
      const initialCategory = mainCategory[0];
      setActiveButtonId(initialCategory.id);
      setSelectedCategory(initialCategory || []);
      setSubCategory(initialCategory.subCategoryData || []);
      setShowItems(false);
      setShowSubCategory(true);
    }
  }, [mainCategory]);

  const handleCategorySelect = (category) => {
    setSearchTerm("");
    setSelectedCategory(category);
    setSelectedSubCategory(null)
    setSubCategory(category.subCategoryData || []);
    setActiveButtonId(category.id);
    setShowItems(false);
    setShowSubCategory(true);
  };

  const handleSubCategorySelect = (subcat) => {
    setSelectedSubCategory(subcat)
    setShowSubCategory(false);
    setShowItems(true);
    setSelectedItems(subcat.itemsData || []);
    setSearchTerm("");
  };

  const handleBackToSubCategory = () => {
    setShowItems(false);
    setShowSubCategory(true);
    setSelectedSubCategory(null)
    setSearchTerm("");
  };

  // Handle search term input
  const handleSearch = (event) => {
    const text = event.target.value;
    setSearchTerm(event.target.value);
    if (text !== '' && selectedCategory.subCategoryData) {
      // Flattening all itemsData arrays into a single array
      const allItemsData = selectedCategory.subCategoryData.reduce((acc, category) => {
        return acc.concat(category.itemsData);
      }, []);

      // Filter items based on search term
      const filteredItems = allItemsData
        ? allItemsData.filter((item) =>
          item.name.toLowerCase().includes(event.target.value.toLowerCase())
        )
        : [];
      setShowItems(true);
      setShowSubCategory(false);
      setShowItems(true);
      setShowSubCategory(false);
      setSelectedItems(filteredItems)
    } else {
      setShowItems(false);
      setShowSubCategory(true);
      setSelectedSubCategory(selectedCategory.subCategoryData)
    }
  };

  return (
    <div className="restaurant-container">
      <div className="business-info">
        {loading ? (
          <Skeleton active title={{ width: "50%" }} paragraph={{ rows: 2 }} />
        ) : (
          <BusinessInfo
            restaurantData={restaurantData}
            restaurantConfig={restaurantConfig}
            loading={loading}
          />
        )}
      </div>

      <div className="main-category-section">
        {loading ? (
          <Skeleton.Button active block />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {mainCategory && mainCategory.length > 0 ? (
              mainCategory.map((cat) => (
                <Button
                  style={{ borderRadius: 20, padding: "8px 16px" }}
                  key={cat.id}
                  type={activeButtonId === cat.id ? "primary" : "default"}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat.name}
                </Button>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>
        )}
      </div>

      <SearchSection searchTerm={searchTerm} onSearch={handleSearch} />

      <div className="sub-category-section" style={{ margin: "20px 0px" }}>
        {showSubCategory &&
          subCategory.map((subCat, index) => (
            <div key={index}>
              <SubCatCard
                selectedCategory={selectedCategory}
                subCategory={subCat}
                onSubCategorySelect={handleSubCategorySelect}
              />
            </div>
          ))}
        {showItems &&

          <ItemList selectedItems={selectedItems} selectedCategory={selectedCategory} selectedSubCategory={selectedSubCategory} currency={restaurantData.currency} />
        }
        {showItems && (
          <NavigationButton onBack={handleBackToSubCategory} />
        )}

        {restaurantConfig.whatsappStatus && restaurantConfig.whatsappLink !== "" && (
          <WhatsAppButton phoneNumber={restaurantConfig.whatsappLink} message={`Welcome to ${restaurantData.name}`} />
        )}
      </div>


    </div>
  );
}

Restaurant.propTypes = {
  restaurantData: PropTypes.object,
  restaurantConfig: PropTypes.object,
  mainCategory: PropTypes.array,
  loading: PropTypes.bool,
};

export default Restaurant;