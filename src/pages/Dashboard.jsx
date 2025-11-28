import { Layout, Row, Col, Card } from "antd";
import { useEffect, useState, useCallback } from "react";
import apiService from "../services/apiService";
import { useSelector } from "react-redux";
const { Content } = Layout;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const getDashboardData = useCallback(async () => {
    setDashboardData([]);
    const response = await apiService.get(`dashboard/counts`, {
      businessId: user.businessId,
    });
    setDashboardData(response.data.data);
  }, [user.businessId]);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  return (
    <div>
      <Content style={{ margin: "16px" }}>
        {/* Responsive Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Main Categories" bordered={false}>
              {dashboardData?.main_category_count ? dashboardData?.main_category_count : 0}{" "}
              Active
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Sub Categories" bordered={false}>
              {dashboardData?.sub_category_count ? dashboardData?.sub_category_count : 0}{" "}
              Active
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Items" bordered={false}>
              {dashboardData?.item_count ? dashboardData?.item_count : 0} Active
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Feedback" bordered={false}>
              {dashboardData?.feedback_count ? dashboardData?.feedback_count : 0} Active
            </Card>
          </Col>

        </Row>
      </Content>
    </div>
  );
};

export default Dashboard;