import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'
import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "./context/themeContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
        <Toaster position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

