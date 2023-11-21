import { Navigate } from "react-router-dom";
import AddPurch from "./addPurch";

const Purchase = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }
  return (
    <div>
      <AddPurch />
    </div>
  );
};

export default Purchase;
