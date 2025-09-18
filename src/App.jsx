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

import Feedback from "./pages/Feedback";
import Import from "./pages/Import";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import { SubscriptionGuard } from "./components/SubscriptionGuard";
import { RenewalPage } from "./pages/RenewalPage";
import { SubscriptionError } from "./pages/SubscriptionError";
import { SubscriptionPlans } from "./pages/SubscriptionPlans";
import Subscriptions from "./pages/Subscriptions";
import { RenewSubscription } from "./pages/RenewSubscription";
import { Payments } from "./pages/Payments";

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/login" element={<Login />} /> {/* Default route */}
        <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>

          <Route path="accounts/payments" element={<Payments />} />
          <Route path="accounts/subscriptions" element={<Subscriptions />} />

          <Route path="subscription-error" element={<SubscriptionError />} />
          <Route path="subscription-plans" element={<SubscriptionPlans />} />
          <Route path="renew-subscription" element={<RenewSubscription />} />

          <Route path="renew" element={<RenewalPage />} />
          <Route path="/" element={<SubscriptionGuard />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="menus/main-category" element={<MainCategory />} />
            <Route path="menus/sub-category" element={<SubCategory />} />
            <Route path="menus/items" element={<Items />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="import" element={<Import />} />
          </Route>

          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;