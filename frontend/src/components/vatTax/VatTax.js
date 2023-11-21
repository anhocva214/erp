import { Navigate } from "react-router-dom";
import GetAllVatTax from "./GetAllVatTax";

const VatTax = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <GetAllVatTax />
    </>
  );
};

export default VatTax;
