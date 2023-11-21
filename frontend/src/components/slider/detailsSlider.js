import { Image, Skeleton } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getSingleSlider } from "../../redux/rtk/features/slider/sliderSlice";

const DetailsSlider = () => {
	//dispatch
	const dispatch = useDispatch();

	const slider = useSelector((state) => state.sliders.slider);

	useEffect(() => {
		dispatch(getSingleSlider());
	}, []);

	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}
	return (
		<div>
			<hr />
			<h2 className=' mt-10 text-center text-xl mb-5'> All Slider Images</h2>
			<div>
				<Skeleton loading={slider === null} active>
					<div className='flex justify-center items-center mb-5'>
						<Image.PreviewGroup>
							<Image
								title={slider?.first_iamge}
								width={300}
								src={slider?.first_image_url}
							/>
							<Image
								title={slider?.second_iamge}
								width={300}
								src={slider?.second_image_url}
							/>
							<Image
								title={slider?.third_iamge}
								width={300}
								src={slider?.third_image_url}
							/>
							<Image
								title={slider?.four_iamge}
								width={300}
								src={slider?.four_image_url}
							/>
						</Image.PreviewGroup>
					</div>
				</Skeleton>
			</div>
		</div>
	);
};

export default DetailsSlider;
