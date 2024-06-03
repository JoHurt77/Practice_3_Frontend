import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// importaciones para la paginación
import LayoutRoutes from './pages/LayoutRoutes';
import Assignments from './pages/Assignments';
import Employees from './pages/Employees';
import Practices from './pages/Practices';
import Proyects from './pages/Proyects';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutRoutes />}>
          <Route index element={<Navigate to="/assignments" />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="employees" element={<Employees />} />
          <Route path="practices" element={<Practices />} />
          <Route path="proyects" element={<Proyects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
