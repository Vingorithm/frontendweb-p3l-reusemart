import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/index";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

// 👉 Patch global: tiap modal ditutup, lepas focus kalau perlu
document.addEventListener('hidden.bs.modal', () => {
  // Lepas focus dari elemen yang masih di dalam modal
  if (document.activeElement) {
    document.activeElement.blur();
  }

  // Opsional: pastikan body tidak punya backdrop ghost
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  document.body.classList.remove('modal-open');
  document.body.style.overflow = ''; // untuk jaga-jaga scroll lock nyangkut
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
