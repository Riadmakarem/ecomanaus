import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { EcoProvider } from "./context/EcoContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EcoProvider>
      <App />
    </EcoProvider>
  </React.StrictMode>,
);