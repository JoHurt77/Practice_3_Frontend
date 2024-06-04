import { Outlet, Link } from "react-router-dom";
import '../styles/NavStyle.css'

const LayoutRoutes = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/assignments">Assignments</Link>
          </li>
          <li>
            <Link to="/employees">Employees</Link>
          </li>
          <li>
            <Link to="/practices">Practices</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default LayoutRoutes;