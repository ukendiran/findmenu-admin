import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import PropTypes from 'prop-types';

const SearchSection = ({ searchTerm, onSearch }) => {
    return (
        <div className="search-section">
            <Input
                style={{ borderRadius: 26 }}
                placeholder="Search..."
                value={searchTerm}
                onChange={onSearch} // Update the search term
                suffix={<SearchOutlined style={{ color: "#8c8c8c", fontSize: "16px" }} />}
            />
        </div>
    );
};

SearchSection.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export default SearchSection;
