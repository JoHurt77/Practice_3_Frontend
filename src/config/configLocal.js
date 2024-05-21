// configuración de la URL en un entorno local
const API_LOCAL_URL = "http://localhost:8080/api/aplicationKinan";

const ENDPOINTS = {
  GET_ALL_EMPLOYEES: `${API_LOCAL_URL}/employees/getAllEmployees`,
  CREATE_EMPLOYEE: `${API_LOCAL_URL}/employees/insertEmployee`,
  UPDATE_EMPLOYEE: `${API_LOCAL_URL}/employees/refreshEmployee`,//el id se envia desde el component
  DELETE_EMPLOYEE: `${API_LOCAL_URL}/employees/deleteEmployee`,//el id se envia desde el component
  GET_ALL_ALLOCATIONS: `${API_LOCAL_URL}/assignments/getAllAssignment`,
};

export default ENDPOINTS;
