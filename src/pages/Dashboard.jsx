import { Layout, Row, Col, Card } from "antd";
import { useEffect, useState } from "react";
import apiService from "../services/apiService";
import { useSelector } from "react-redux";

const { Content } = Layout;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const user = token.data

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    setDashboardData([]);
    const response = await apiService.post("dashboard/getcount", {
      restaurantId: user.restaurantId,
    });
    setDashboardData(response.data.data);
  };

  return (
    <div>
      <Content style={{ margin: "16px" }}>
        {/* Responsive Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Main Categories" bordered={false}>
              {dashboardData?.maincategory ? dashboardData?.maincategory : 0}{" "}
              Active
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Sub Categories" bordered={false}>
              {dashboardData?.subcategory ? dashboardData?.subcategory : 0}{" "}
              Active
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Items" bordered={false}>
              {dashboardData?.items ? dashboardData?.items : 0} Active
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Feedback" bordered={false}>
              98% Positive
            </Card>
          </Col>
        </Row>
      </Content>
    </div>
  );
};

export default Dashboard;
