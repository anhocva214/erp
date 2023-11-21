import jwtDecode from "jwt-decode";

const checkTokenExp = (token, customer) => {
  //   console.log(token);
  try {
    if (jwtDecode(token).exp * 1000 < Date.now()) {
      console.log("Time Expired");
      if (customer) {
        return (window.location.href = "customer/logout");
      } else {
        return (window.location.href = "/admin/auth/logout");
      }
    } else {
      console.log("Time Not Expired");
    }
  } catch (error) {
    console.log("error");
  }
};

export default checkTokenExp;
