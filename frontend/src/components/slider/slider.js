import { Navigate } from "react-router-dom";
import AddSlider from "./addSlider";
import DetailsSlider from "./detailsSlider";

const Slider = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <AddSlider />
      <DetailsSlider />
    </>
  );
};

export default Slider;
