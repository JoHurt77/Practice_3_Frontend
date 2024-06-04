import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot desde react-dom/client
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// importaciones para la paginación
import LayoutRoutes from './pages/LayoutRoutes';
import Assignments from './pages/Assignments';
import Employees from './pages/Employees';
import Practices from './pages/Practices';
import Projects from './pages/Projects';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutRoutes />}>
          <Route index element={<Navigate to="/assignments" />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="employees" element={<Employees />} />
          <Route path="practices" element={<Practices />} />
          <Route path="projects" element={<Projects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
