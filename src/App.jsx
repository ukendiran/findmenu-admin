import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";

import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import GenerateQR from "./pages/GenerateQR";

// import Website from "./layouts/Website";
import "./App.css";
import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./admin/AdminLayout";

// AdminPanel
import Settings from "./admin/Settings";
import Dashboard from "./admin/Dashboard";
import UserProfile from "./admin/userProfile";
import MainCategory from "./admin/MainCategory";
import SubCategory from "./admin/SubCategory";
import Items from "./admin/Items";
import Payments from "./admin/Payments";
import Feedback from "./admin/Feedback";
import Import from "./admin/Import";


import AppLayout from "./app/AppLayout";
import RestaurantNotFound from "./app/RestaurantNotFound";
import ScanMenu from "./app/ScanMenu";

import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";


const App = () => {

  return (
    <BrowserRouter>
      <Routes>

        {/* Site Routes */}
        <Route path="/" element={<SiteLayout />}>
          <Route path="" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="generateqr" element={<GenerateQR />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="return-policy" element={<RefundPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> {/* Default route */}
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

        {/* App Routes */}
        <Route path="/p/letoit/menu" element={<Navigate to={"/p/letoit"} />} />
        <Route path="/letoit/menu" element={<Navigate to={"/p/letoit"} />} />
        <Route path="/scanmenu" element={<RestaurantNotFound />} />
        <Route path="/scanmenu" element={<ScanMenu />} />
        <Route path="/p/:restaurant" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
