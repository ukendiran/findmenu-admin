import { Card, Row, Col, Image, Tag } from 'antd';
import PropTypes from 'prop-types';
import "./ItemList.css"
import ParagraphList from '../../components/ParagraphList';

const ItemList = ({ selectedItems, selectedCategory, selectedSubCategory, currency }) => {
    return (
        <div className='item-holder'>
            {selectedItems.map((item, index) => (
                <Card
                    key={index}
                    style={{
                        margin: "20px 0",
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: 10,
                        padding: 0,
                        overflow: 'hidden'
                    }}
                    bordered={false}
                >
                    <Row gutter={0} style={{ margin: 0 }}>
                        <Col xs={24} sm={24} style={{ padding: 0 }}>
                            {item.image && !item.image.includes('no-image.png') && (
                                <div style={{
                                    width: '100%',
                                    height: '150px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        preview={false}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                    />
                                </div>
                            )}

                            {
                                (item.isAvailable == 2 ||
                                    selectedCategory?.isAvailable == 2 ||
                                    selectedSubCategory?.isAvailable == 2) &&
                                <Tag color="red" style={{ marginLeft: 10, top: 10 }}>Currently not available</Tag>
                            }

                            <div style={{
                                padding: "16px",
                                background: '#fff'
                            }}>
                                <h2 style={{
                                    margin: 0,
                                    marginBottom: '8px',
                                    fontSize: '18px',
                                    fontWeight: '600'
                                }}>
                                    {item.name}
                                </h2>
                                {item.price &&
                                    item.price !== "0" &&
                                    item.price !== 'undefined' &&
                                    item.price !== 'null' && (
                                        <p style={{
                                            margin: '8px 0',
                                            fontSize: '16px',
                                            color: '#666'
                                        }}>
                                            {(currency == 'doller' ? '$' : "₹")} {item.price}
                                        </p>
                                    )}
                                {item.description &&
                                    item.description !== "0" &&
                                    item.description !== 'undefined' &&
                                    item.description !== 'null' && (
                                        <ParagraphList text={item.description} maxLength={100} />
                                    )}
                            </div>
                        </Col>
                    </Row>
                </Card>
            ))}
        </div>
    );
};

ItemList.propTypes = {
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            image: PropTypes.string,
            name: PropTypes.string.isRequired,
            price: PropTypes.string,
            description: PropTypes.string
        })
    ).isRequired,
    selectedCategory: PropTypes.any,
    selectedSubCategory: PropTypes.any,
    currency: PropTypes.string
};

export default ItemList;
