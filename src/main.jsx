import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "antd/dist/reset.css"; // Import Ant Design's CSS reset
import "./index.css";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import theme from "./utils/theme.js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <PayPalScriptProvider options={{ "client-id":  import.meta.env.PAYPAL_CLIENT_ID}}>
          <App />
        </PayPalScriptProvider>
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
