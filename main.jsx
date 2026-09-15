import React from "react";
import ReactDOM from "react-dom/client";
import CareerExplorerApp from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div style={{ padding: "32px 16px", display: "flex", justifyContent: "center" }}>
      <CareerExplorerApp />
    </div>
  </React.StrictMode>
);
