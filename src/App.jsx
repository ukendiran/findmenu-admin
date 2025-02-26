import { Routes, Route, BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import packageJson from "../package.json"; // Import version from package.json
import "./App.css";

// AdminPanel
import AdminLayout from "./AdminLayout";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import MainCategory from "./pages/MainCategory";
import SubCategory from "./pages/SubCategory";
import Items from "./pages/Items";
import Payments from "./pages/Payments";
import Feedback from "./pages/Feedback";
import Import from "./pages/Import";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const VersionHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appVersion = packageJson.version;

  useEffect(() => {
    if (!location.search.includes("v=")) {
      navigate(`${location.pathname}?v=${appVersion}`, { replace: true });
    }
  }, [location, navigate, appVersion]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <VersionHandler />
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="payments" element={<Payments />} />
          <Route path="menus/main-category" element={<MainCategory />} />
          <Route path="menus/sub-category" element={<SubCategory />} />
          <Route path="menus/items" element={<Items />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="import" element={<Import />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
