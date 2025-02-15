import { Col, Row, Typography, Skeleton, Tooltip, Space } from "antd";
import { FacebookFilled, GlobalOutlined, InstagramFilled, WifiOutlined, YoutubeFilled } from "@ant-design/icons";
import PropTypes from 'prop-types';
import RatingComponent from "./RatingComponent";
import ParagraphList from "../../components/ParagraphList";



const { Title, Text } = Typography;

const BusinessInfo = ({ restaurantData, restaurantConfig, loading }) => {

    const handleAddress = () => {
        if (restaurantConfig.googleMapStatus === 1 && restaurantConfig.googleMapLink !== null && restaurantConfig.googleMapLink !== "")
            window.location.href = restaurantConfig.googleMapLink;
    };
    const handleInstagaram = () => {
        if (restaurantConfig.instagramStatus === 1 && restaurantConfig.instagramLink !== null && restaurantConfig.instagramLink !== "")
            window.location.href = restaurantConfig.instagramLink;
    };
    const handleFacebook = () => {
        if (restaurantConfig.facebookStatus === 1 && restaurantConfig.facebookLink !== null && restaurantConfig.facebookLink !== "")
            window.location.href = restaurantConfig.facebookLink;
    };

    const handleYoutube = () => {
        if (restaurantConfig.youtubeStatus === 1 && restaurantConfig.youtubeLink !== null && restaurantConfig.youtubeLink !== "")
            window.location.href = restaurantConfig.youtubeLink;
    };
    // const handleTripadvisor = () => {
    //   if (restaurantConfig.tripadvisorStatus === 1 && restaurantConfig.tripadvisorLink !== null && restaurantConfig.tripadvisorLink !== "")
    //     window.location.href = restaurantConfig.tripadvisorLink;
    // };


    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>


            <Row justify="space-between" align="middle">
                <Col span={24}>
                    {/* Title and Skeleton Loader */}
                    {loading && restaurantData ? (
                        <Skeleton
                            active
                            title={false}
                            paragraph={{ rows: 2, width: ["60%", "80%"] }}
                        />
                    ) : (
                        <Title level={2} style={{ margin: 0 }}>
                            {restaurantData?.name.toUpperCase()}
                        </Title>
                    )}

                    {/* Rating Component */}
                    <div style={{ margin: "16px 0" }}>
                        {loading ? (
                            <Skeleton
                                active
                                title={false}
                                paragraph={{ rows: 1, width: "40%" }}
                            />
                        ) : (
                            <RatingComponent restaurantConfig={restaurantConfig} restaurantData={restaurantData} />
                        )}
                    </div>


                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <GlobalOutlined style={{ fontSize: "16px", color: "#8c8c8c" }} />
                        {loading ? (
                            <Skeleton.Input active style={{ width: "60%" }} />
                        ) : (
                            <Tooltip title="Click to view map">
                                <Text style={{ cursor: "pointer" }} onClick={handleAddress}>
                                    {restaurantData.address}
                                </Text>
                            </Tooltip>
                        )}
                    </div>


                    <Space>
                        {restaurantConfig.wifiPasswordStatus === 1 &&
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginTop: 10,
                                }}
                            >

                                {loading ? (
                                    <Skeleton.Input active style={{ width: "60%" }} />
                                ) : (
                                    <Tooltip title={restaurantConfig.wifiPassword}>
                                        <Text style={{ cursor: "pointer" }}>
                                            <WifiOutlined style={{ fontSize: "16px", color: "#8c8c8c" }} />
                                        </Text>
                                    </Tooltip>
                                )}
                            </div>
                        }


                        {restaurantConfig.instagramStatus === 1 &&
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginTop: 10,
                                }}
                            >

                                {loading ? (
                                    <Skeleton.Input active style={{ width: "60%" }} />
                                ) : (
                                    <Tooltip title="Click to Instagaram">
                                        <Text style={{ cursor: "pointer" }} onClick={handleInstagaram}>
                                            <InstagramFilled style={{ fontSize: "16px", color: "#8c8c8c" }} />
                                        </Text>
                                    </Tooltip>
                                )}
                            </div>
                        }

                        {restaurantConfig.facebookStatus === 1 &&
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginTop: 10,
                                }}
                            >

                                {loading ? (
                                    <Skeleton.Input active style={{ width: "60%" }} />
                                ) : (
                                    <Tooltip title="Click to Facebook">
                                        <Text style={{ cursor: "pointer" }} onClick={handleFacebook}>
                                            <FacebookFilled style={{ fontSize: "16px", color: "#8c8c8c" }} />
                                        </Text>
                                    </Tooltip>
                                )}
                            </div>
                        }

                        {restaurantConfig.youtubeStatus === 1 &&
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginTop: 10,
                                }}
                            >

                                {loading ? (
                                    <Skeleton.Input active style={{ width: "60%" }} />
                                ) : (
                                    <Tooltip title="Click to Youtube">
                                        <Text style={{ cursor: "pointer" }} onClick={handleYoutube}>
                                            <YoutubeFilled style={{ fontSize: "16px", color: "#8c8c8c" }} />
                                        </Text>
                                    </Tooltip>
                                )}
                            </div>
                        }

                        {/* {restaurantConfig.tripadvisorStatus === 2 &&
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: 10,
                }}
              >

                {loading ? (
                  <Skeleton.Input active style={{ width: "60%" }} />
                ) : (
                  <Tooltip title="Click to Tripadvisor">
                    <Text style={{ cursor: "pointer" }} onClick={handleTripadvisor}>
                      <TripAdvisorIcon style={{ fontSize: "16px", color: "#8c8c8c" }} />
                    </Text>
                  </Tooltip>
                )}
              </div>
            } */}




                    </Space>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: 20,
                        }}
                    >
                        {loading ? (
                            <Skeleton active title={false} paragraph={{ rows: 3 }} />
                        ) : (
                            <ParagraphList
                                text={restaurantData.description}
                                maxLength={200}
                            />
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

BusinessInfo.propTypes = {
    restaurantData: PropTypes.any,
    restaurantConfig: PropTypes.shape({
        googleMapStatus: PropTypes.number,
        googleMapLink: PropTypes.string,
        instagramStatus: PropTypes.number,
        instagramLink: PropTypes.string,
        facebookStatus: PropTypes.number,
        facebookLink: PropTypes.string,
        youtubeStatus: PropTypes.number,
        youtubeLink: PropTypes.string,
        wifiPasswordStatus: PropTypes.number,
        wifiPassword: PropTypes.string,
    }),
    loading: PropTypes.bool,
};

export default BusinessInfo;
