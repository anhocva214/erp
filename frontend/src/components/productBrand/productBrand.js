import { Navigate } from "react-router-dom";
import GetAllProductBrand from "./getAllProductBrand";

const ProductBrand = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllProductBrand />
    </>
  );
};

export default ProductBrand;
