import { Outlet, Link } from "react-router-dom";
import '../styles/NavStyle.css'

const LayoutRoutes = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/allocations">Allocations</Link>
          </li>
          <li>
            <Link to="/employees">Employees</Link>
          </li>
          <li>
            <Link to="/practices">Practices</Link>
          </li>
          <li>
            <Link to="/proyects">Proyects</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default LayoutRoutes;