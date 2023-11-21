import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Form, Row, Typography, Upload } from "antd";
import styles from "./AddSlider.module.css";

import { Fragment, useState } from "react";

import { useDispatch } from "react-redux";
import {
	createSlider,
	getSingleSlider,
} from "../../redux/rtk/features/slider/sliderSlice";

const AddSlider = ({ drawer }) => {
	const dispatch = useDispatch();
	const { Title } = Typography;
	const [form] = Form.useForm();
	const [loader, setLoader] = useState(false);
	const [sliderList, setSliderList] = useState([]);
	const [sliderError, setSliderError] = useState(undefined);

	const onFinish = async (values) => {
		if (sliderList.length === 4) {
			setSliderError(false);
			let formData = new FormData();
			formData.append("images", sliderList[0].originFileObj);
			formData.append("images", sliderList[1].originFileObj);
			formData.append("images", sliderList[2].originFileObj);
			formData.append("images", sliderList[3].originFileObj);

			try {
				const resp = await dispatch(createSlider(formData));

				if (resp.payload.message === "success") {
					setLoader(false);
					setSliderList([]);
					form.resetFields();
					dispatch(getSingleSlider());
				} else {
					setLoader(false);
				}
			} catch (error) {
				console.log(error.message);
			}
		} else {
			setSliderError(true);
		}
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
		setLoader(false);
	};

	const onClickLoading = () => {
		if (sliderList.length === 4) setLoader(true);
	};

	return (
		<Fragment>
			<Row className='mr-top center' gutter={[0, 30]}>
				<Col
					xs={24}
					sm={24}
					md={24}
					lg={drawer ? 22 : 11}
					xl={drawer ? 22 : 11}
					className='rounded column-design'>
					<Card bordered={false} className='criclebox h-full'>
						<Title level={4} className='m-2 text-center'>
							Add Slider Images
						</Title>
						{sliderList.lenght !== 4 && (
							<Alert
								className='mb-2'
								message='Warning'
								description='You Have to upload 4 slider images!'
								type='warning'
								showIcon
								closable
							/>
						)}
						<Form
							form={form}
							className=''
							name='basic'
							initialValues={{
								remember: true,
							}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete='off'>
							<h3 className='text-center mt-3 mb-4 text-red-400 font-semibold'>
								Upload 4 Slider Images
							</h3>

							<Form.Item
								className='text-center'
								valuePropName='slider_images'
								required={true}>
								<Upload
									className=''
									listType='picture-card'
									beforeUpload={() => false}
									name='image'
									fileList={sliderList}
									minCount={4}
									maxCount={4}
									onChange={(images) => setSliderList(images.fileList)}>
									<div>
										<PlusOutlined />
										<div
											style={{
												marginTop: 8,
											}}>
											Upload
										</div>
									</div>
								</Upload>
								<p style={{ color: "red" }}>
									{sliderError === true && "Please upload 4 sliders!"}
								</p>
							</Form.Item>

							<Form.Item
								style={{ marginBottom: "10px" }}
								className={styles.addSliderBtnContainer}>
								<Button
									onClick={onClickLoading}
									loading={loader}
									type='primary'
									htmlType='submit'
									shape='round'
									{...{
										disabled: sliderList.length !== 4,
									}}>
									Add Slider
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

export default AddSlider;
