import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "antd/dist/reset.css"; // Import Ant Design's CSS reset
import "./index.css";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import theme from "./utils/theme.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
