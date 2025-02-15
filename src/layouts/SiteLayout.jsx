import { Outlet } from "react-router-dom";
import { Layout } from "antd";

import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
const { Content } = Layout;

const SiteLayout = () => {
  
  return (
    <Layout>
      {/* Header */}
      <SiteHeader />
      {/* Content */}
      <Content
        style={{
          marginTop: 100,
          marginBottom: 20,
          minHeight: "60vh",
        }}
      >
        <Outlet />
      </Content>
      {/* Footer */}
      <SiteFooter />
    </Layout>
  );
};

export default SiteLayout;
