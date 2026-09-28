import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./rebuild/Home.jsx";
import IntakeForm from "./IntakeForm.jsx";

// /intake keeps working exactly as before; it gets restyled in phase 4.
const isIntake =
  window.location.pathname.startsWith("/intake") ||
  new URLSearchParams(window.location.search).has("intake");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isIntake ? <IntakeForm /> : <Home />}
  </React.StrictMode>
);
