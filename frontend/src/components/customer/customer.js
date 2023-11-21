import { Navigate } from "react-router-dom";
import GetAllCustomer from "./getAllCust";

const Customer = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllCustomer />
    </>
  );
};

export default Customer;
