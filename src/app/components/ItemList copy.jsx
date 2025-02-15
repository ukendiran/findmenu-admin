import { Card, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import './ItemList.css'

const ItemList = ({ selectedItems }) => {
    return (
        <div style={{ padding: 0 }} className='item-holder'>
            {selectedItems.map((item, index) => (

                <div key={index}>
                    <Card style={{
                        margin: "20px 0",
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Drop shadow
                        borderRadius: 10, // Rounded corners
                        padding: 0,
                    }}
                    >
                        <Row gutter={16} align="middle" style={{ padding: 0, margin: 0 }}>
                            {item.image && !item.image.includes('no-image.png') && (
                                <Col xs={24} sm={8} style={{ padding: 0, margin: 0 }}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: 10
                                        }}
                                    />
                                </Col>
                            )}
                            <Col xs={24} sm={item.image && !item.image.includes('no-image.png') ? 16 : 24} >
                                <div style={{ marginTop: 10, padding: "10px" }}>
                                    <h2>{item.name}</h2>
                                    {item.price !== "0"
                                        && item.price !== 'undefined'
                                        && item.price !== undefined
                                        && item.price !== 'null'
                                        &&
                                        <p>₹ {item.price}</p>
                                    }
                                    {item.description !== "0"
                                        && item.description !== 'undefined'
                                        && item.description !== undefined
                                        && item.description !== 'null'
                                        &&
                                        <p> {item.description}</p>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <Card
                        key={index}
                        style={{
                            margin: "20px 0",
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Drop shadow
                            borderRadius: 10, // Rounded corners
                            padding: 0,
                        }}
                    >
                        <Row gutter={16} align="middle" style={{ padding: 0, margin: 0 }}>
                            <Col xs={24} sm={item.image && !item.image.includes('no-image.png') ? 16 : 24} >
                                <div style={{ marginTop: 10, padding: "10px" }}>
                                    <h2>{item.name}</h2>
                                    {item.price !== "0"
                                        && item.price !== 'undefined'
                                        && item.price !== undefined
                                        && item.price !== 'null'
                                        &&
                                        <p>₹ {item.price}</p>
                                    }
                                    {item.description !== "0"
                                        && item.description !== 'undefined'
                                        && item.description !== undefined
                                        && item.description !== 'null'
                                        &&
                                        <p> {item.description}</p>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Card>

                </div>

            ))}
        </div>
    );
};

ItemList.propTypes = {
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            image: PropTypes.string,
            name: PropTypes.string,
            price: PropTypes.string,
            description: PropTypes.string,
        })
    ).isRequired,
};

export default ItemList;