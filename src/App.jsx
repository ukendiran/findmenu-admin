import { Routes, Route, BrowserRouter } from "react-router-dom";
// import Website from "./layouts/Website";
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



const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/login" element={<Login />} /> {/* Default route */}
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