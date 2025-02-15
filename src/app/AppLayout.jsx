import { Layout, Image } from "antd";
import { getUrl } from "../utils/common";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import siteApiService from "../services/siteApiService";
import FeadbackTextArea from "./components/FeadbackTextArea";
import LoadingScreen from "./components/LoadingScreen";

import Restaurant from "./Restaurant";

const { Header, Content } = Layout;

const AppLayout = () => {
  const restaurantCode = getUrl(2);
  const [restaurantData, setRestaurantData] = useState([]);
  const [restaurantConfig, setRestaurantConfig] = useState([]);
  const [mainCategory, setMainCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRestaurantData = async () => {
      setLoading(true)
      try {
        const response = await siteApiService.post("/restaurant/getRestaturantDetails", {
          restaurantCode: getUrl(2),
        });
        if (response.data.data) {
          const data = response.data?.data[0];
          console.log(data)
          setRestaurantData(data);
          if (data?.mainCategoryData) {
            setMainCategory(data?.mainCategoryData);
          }
          if (data?.configData) {
            setRestaurantConfig(JSON.parse(data?.configData)[0]);
          }
        } else {
          navigate('/scanmenu')
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        minWidth: "320px",
        maxWidth: "550px",
        margin: "0px auto",
        background: "#efefef",
      }}
    >
      <Header
        className="header"
        style={{
          background: "#000",
          backgroundImage: restaurantData.bannerImage
            ? `url(${restaurantData.bannerImage})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 300,
          width: "100%",
          position: "relative", // Added to establish positioning context
        }}
      >
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          {restaurantData && restaurantData.image ? (
            <Image
              src={restaurantData.image}
              width={120}
              height={120}
              preview={false}
              alt="Logo"
              style={{
                borderRadius: "50%",
              }}
            />
          ) : (
            <h1 style={{ color: "#fff", fontSize: 32, marginTop: 40 }}>
              {restaurantCode.toUpperCase()}
            </h1>
          )}
        </div>
      </Header>
      <Content
        style={{
          padding: "10px",
          borderRadius: "20px",
          marginTop: "-100px",
          zIndex: 100,
          height: "auto",
          backgroundColor: "#fff",
        }}
      >
        {loading && (
          <LoadingScreen loading={loading} />
        )}

        {!loading && restaurantData &&
          <Restaurant
            restaurantData={restaurantData}
            restaurantConfig={restaurantConfig}
            mainCategory={mainCategory}
            loading={loading} />
        }
      </Content>

      <div
        style={{
          borderRadius: "20px",
          textAlign: "center",
          color: "#333",
          background: "#fff",
          padding: 30,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <div style={{}}>
          {restaurantConfig && restaurantConfig.showFeedbackForm === 1 && <FeadbackTextArea restaurantId={restaurantData.id} />}
        </div>

        <div
          style={{
            textAlign: "center",
            color: "#333",
            background: "#fff",

            marginTop: 30,
          }}
        >
          ©2025 <a href="/" style={{ color: 'green' }}>FindMenu</a>
        </div>
      </div>

    </Layout>
  );
};

export default AppLayout;
