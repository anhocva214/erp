import { Button, Card, Form, Input, Select, Space, Typography } from "antd";
import styles from "./AddProdSubcat.module.css";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { loadAllProductCategory } from "../../redux/rtk/features/productCategory/productCategorySlice";
import { addProductSubCategory } from "../../redux/rtk/features/productSubCategory/productSubCategorySlice";
import UploadMany from "../Card/UploadMany";
import BigDrawer from "../Drawer/BigDrawer";
import AddProductCategory from "../productCategory/addProductCategory";

const AddProductSubCategory = ({ drawer }) => {
	const category = useSelector((state) => state.productCategories?.list);
	const dispatch = useDispatch();
	const { Title } = Typography;
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const onClick = () => {
		setLoading(true);
	};

	const [selectedValue, setSelectedValue] = useState(null);

	const onSelect = (value) => {
		setSelectedValue(value);
	};

	const onFinish = async (values) => {
		try {
			const resp = await dispatch(
				addProductSubCategory({
					...values,
					productCategoryId: selectedValue,
				})
			);

			if (resp.payload.message === "success") {
				setLoading(false);
				form.resetFields();
				setSelectedValue(null);
			} else {
				setLoading(false);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	//dispatch category in a useEffect
	useEffect(() => {
		dispatch(loadAllProductCategory({ page: 1, count: 100 }));
	}, [dispatch]);

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
		setLoading(false);
	};

	return (
		<>
			<Card bordered={false} className='criclebox h-full'>
				<Title level={4} className='m-2 text-center'>
					Add Product Subcategory
				</Title>
				<Form
					form={form}
					className=''
					name='basic'
					labelCol={{
						span: 5,
					}}
					wrapperCol={{
						span: 16,
					}}
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete='off'>
					<Form.Item
						style={{ marginBottom: "10px" }}
						label='Name'
						name='name'
						rules={[
							{
								required: true,
								message: "Please input category name!",
							},
						]}>
						<Input />
					</Form.Item>

					<Form.Item
						style={{ marginBottom: "15px" }}
						name='productCategoryId'
						label='Select Category '
						rules={[
							selectedValue === null && {
								required: true,
								message: "Please select category!",
							},
						]}>
						<Space.Compact block>
							<Select
								onSelect={onSelect}
								name='productCategoryId'
								loading={!category}
								showSearch
								placeholder='Select Category'
								optionFilterProp='children'
								filterOption={(input, option) =>
									option.children.includes(input)
								}
								filterSort={(optionA, optionB) =>
									optionA.children
										.toLowerCase()
										.localeCompare(optionB.children.toLowerCase())
								}>
								{category &&
									category.map((cate) => (
										<Select.Option key={cate.id} value={cate.id}>
											{cate.name}
										</Select.Option>
									))}
							</Select>
							<BigDrawer
								title={"new Category"}
								btnTitle='Category'
								children={<AddProductCategory drawer={true} />}
							/>
						</Space.Compact>
					</Form.Item>

					<Form.Item
						style={{ marginBottom: "10px" }}
						className={styles.addProdSubCatBtnContainer}>
						<Button
							onClick={onClick}
							loading={loading}
							type='primary'
							htmlType='submit'
							shape='round'>
							Add Subcategory
						</Button>
					</Form.Item>
				</Form>
				<Card bordered={false}>
					<Title level={4} className='m-2 text-center'>
						Import From CSV
					</Title>
					<UploadMany urlPath={"subcategory"} />
				</Card>
			</Card>
		</>
	);
};

export default AddProductSubCategory;
