import GetAllProd from "./getAllProd";

import { Navigate } from "react-router-dom";

const Product = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllProd />
    </>
  );
};

export default Product;
