import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/index";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
