import { Outlet } from "react-router-dom";
import getPermissions from "../../utils/getPermissions";
import { toast } from "react-toastify";

const UserPrivateRoute = ({ path, permission, ...props }) => {
	const permissions = getPermissions();

	if (permissions?.includes(permission)) {
		return <Outlet />;
	} else {
		return <> {toast.error("You are not Authorized , Contact with Admin")}</>;
	}
};

export default UserPrivateRoute;
