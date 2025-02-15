import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const CustomBreadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Utility function to format each segment
  const formatSegment = (segment) => {
    // Replace hyphens with spaces
    const withSpaces = segment.replace(/-/g, ' ');
    // Capitalize the first letter
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  };

  // Split the pathname into segments, filter out empty strings and 'admin'
  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean)
    .filter(segment => segment !== 'admin');

  // Create breadcrumb items
  const breadcrumbItems = [
    {
      title: <HomeOutlined />,
      key: 'home',
      onClick: () => navigate('/dashboard'),
    },
    ...pathSegments.map((segment, index) => ({
      title: formatSegment(segment),
      key: index,
    })),
  ];

  return <Breadcrumb items={breadcrumbItems} />;
};

export default CustomBreadcrumb;
