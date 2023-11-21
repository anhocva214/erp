import {
	DeleteOutlined,
	EditOutlined,
	SolutionOutlined,
} from "@ant-design/icons";
import { Button, Card, Popover, Typography } from "antd";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	clearUser,
	deleteStaff,
	loadSingleStaff,
} from "../../redux/rtk/features/user/userSlice";
import Loader from "../loader/loader";

//PopUp

const DetailStaff = () => {
	const { id } = useParams();
	let navigate = useNavigate();

	//dispatch
	const dispatch = useDispatch();
	const user = useSelector((state) => state.users.user);

	//Delete Supplier
	const onDelete = () => {
		try {
			dispatch(deleteStaff(id));

			setVisible(false);
			toast.warning(`User Name : ${user.username} is removed `);
			return navigate("/admin/hr/staffs");
		} catch (error) {
			console.log(error.message);
		}
	};
	// Delete Supplier PopUp
	const [visible, setVisible] = useState(false);

	const handleVisibleChange = (newVisible) => {
		setVisible(newVisible);
	};

	useEffect(() => {
		dispatch(loadSingleStaff(id));
		return () => {
			dispatch(clearUser());
		};
	}, [id]);

	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}
	return (
		<div>
			<div className='mr-top'>
				{user ? (
					<Fragment key={user.id}>
						<Card bordered={false} className='card-custom'>
							<div className='card-header d-flex justify-content-between m-3'>
								<h5>
									<SolutionOutlined />
									<span className='mr-left'>
										ID : {user.id} | {user.username}
									</span>
								</h5>
								<div className='text-end'>
									<Link
										className='m-2'
										to={`/admin/hr/staffs/${user.id}/update`}
										state={{ data: user }}>
										<Button
											type='primary'
											shape='round'
											icon={<EditOutlined />}></Button>
									</Link>
									<Popover
										className='m-2'
										content={
											<a onClick={onDelete}>
												<Button type='primary' danger>
													Yes Please !
												</Button>
											</a>
										}
										title='Are you sure you want to delete ?'
										trigger='click'
										visible={visible}
										onVisibleChange={handleVisibleChange}>
										<Button
											type='danger'
											shape='round'
											icon={<DeleteOutlined />}></Button>
									</Popover>
								</div>
							</div>
							<div className='card-body m-3'>
								<p>
									<Typography.Text strong>ID No :</Typography.Text> {user.idNo}
								</p>
								<p>
									<Typography.Text strong>Role :</Typography.Text> {user.role}
								</p>
								<p>
									<Typography.Text strong>email :</Typography.Text> {user.email}
								</p>
								<p>
									<Typography.Text strong>salary :</Typography.Text>{" "}
									{user.salary}
								</p>
								<p>
									<Typography.Text strong>Designation ID :</Typography.Text>{" "}
									{user.designationId}
								</p>
								<p>
									<Typography.Text strong>department :</Typography.Text>{" "}
									{user.department}
								</p>
								<p>
									<Typography.Text strong>phone :</Typography.Text> {user.phone}
								</p>
								<p>
									<Typography.Text strong>address :</Typography.Text>{" "}
									{user.address}
								</p>
								<p>
									<Typography.Text strong>Blood Group :</Typography.Text>{" "}
									{user.bloodGroup}
								</p>

								<p>
									<Typography.Text strong>Joining Date</Typography.Text>{" "}
									{moment(user.joinDate).format("YYYY-MM-DD")}
								</p>

								<p>
									<Typography.Text strong>Leave Date</Typography.Text>{" "}
									{moment(user.leaveDate).format("YYYY-MM-DD")}
								</p>
							</div>
						</Card>
					</Fragment>
				) : (
					<Loader />
				)}
			</div>
		</div>
	);
};

export default DetailStaff;
