import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { EcoProvider } from "./context/EcoContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <EcoProvider>
        <App />
      </EcoProvider>
    </AuthProvider>
  </React.StrictMode>,
);
