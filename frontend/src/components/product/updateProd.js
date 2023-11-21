import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Upload } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSingleProduct } from "../../redux/rtk/features/product/productSlice";
import { loadAllProductBrand } from "../../redux/rtk/features/productBrand/productBrandSlice";
import { loadAllProductCategory } from "../../redux/rtk/features/productCategory/productCategorySlice";
import { loadAllProductSubCategory } from "../../redux/rtk/features/productSubCategory/productSubCategorySlice";

import styles from "./AddProd.module.css";

import axios from "axios";
import { useParams } from "react-router-dom";
import { loadAllColor } from "../../redux/rtk/features/color/colorSlice";
import BigDrawer from "../Drawer/BigDrawer";
import AddProductCategory from "../ProductSubcategory/addProductSubcategory";
import Loader from "../loader/loader";
import AddProductBrand from "../productBrand/addProductBrand";
import { removeFalsyProperties } from "./../../utils/functions";
import ColorDropdown from "./colorDropDown";
// Quill modules to add features like toolbar, image upload, etc.
const textEditorModule = {
	toolbar: [
		[{ header: "1" }, { header: "2" }, { font: [] }],
		[{ list: "ordered" }, { list: "bullet" }],
		["bold", "italic", "underline"],
		["link", "image"],
		[{ color: [] }, { background: [] }],
		["clean"],
	],
};

// Quill formats to specify allowed styles
const textEditorFormats = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
	"list",
	"bullet",
	"indent",
	"link",
	"image",
	"color",
	"background",
];

//Update Product API REQ
const updateProduct = async (id, values) => {
	try {
		await axios({
			method: "put",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			url: `product/${id}`,
			data: values,
		});
		return "success";
		// return data;
	} catch (error) {
		console.log(error.message);
	}
};
const UpdateProduct = () => {
	const unitType = ["kg", "ltr", "pc"];
	const { id } = useParams();
	const category = useSelector((state) => state.productCategories?.list);
	const subCategory = useSelector((state) => state.productSubCategories?.list);
	const brand = useSelector((state) => state.productBrands?.list);
	const { product, loading } = useSelector((state) => state.products);
	const { list: color } = useSelector((state) => state.colors);

	const dispatch = useDispatch();

	const [thumbFileList, setThumbFileList] = useState([]);
	const [loader, setLoader] = useState(false);

	const [prodSubCat, setProdSubCat] = useState(null);
	const [prodBrand, setProdBrand] = useState(null);
	const [prodDescription, setProdDescription] = useState("");

	const prodSubCatHandler = (val) => {
		setProdSubCat(val);
	};

	const prodBrandHandler = (val) => {
		setProdBrand(val);
	};

	const prodDescriptionHandler = (val) => {
		setProdDescription(val);
	};

	const [selectedColors, setSelectedColors] = useState([]);

	const colorsHandler = (val) => {
		setSelectedColors(val);
	};

	const [form] = Form.useForm();

	const onFinish = async (values) => {
		const data = removeFalsyProperties(values);
		setLoader(true);
		try {
			let formData = new FormData();

			thumbFileList[0]?.originFileObj &&
				formData.append("images", thumbFileList[0]?.originFileObj);
			formData.append("name", data.name);
			formData.append("productSubCategoryId", prodSubCat);
			formData.append("productBrandId", prodBrand);
			formData.append("sku", data.sku);
			formData.append("unitType", data.unitType);
			formData.append("unitMeasurement", data.unitMeasurement);
			formData.append("productPurchasePrice", data.productPurchasePrice);
			formData.append("productSalePrice", data.productSalePrice);
			formData.append("productQuantity", data.productQuantity);
			formData.append("reorderQuantity", data.reorderQuantity);
			formData.append("description", prodDescription);
			data.productVat &&
				formData.append("productVat", parseInt(data.productVat));
			formData.append("colors", selectedColors);

			const resp = await updateProduct(id, formData);

			if (resp === "success") {
				toast.success("Product updated successfully");
				setLoader(false);
			} else {
				setLoader(false);
			}
		} catch (error) {
			console.log(error);
			toast.error("error at creating");
			setLoader(false);
		}
	};

	const onFinishFailed = (errorInfo) => {
		setLoader(false);
		toast.error("Something went wrong !");
		console.log("Failed:", errorInfo);
	};

	const handelThumbImageChange = ({ fileList }) => {
		setThumbFileList(fileList);
	};

	//useEffect for loading category list from redux
	useEffect(() => {
		dispatch(loadSingleProduct(id));
		dispatch(loadAllProductCategory({ page: 1, count: 100, status: true }));
		dispatch(loadAllProductSubCategory({ page: 1, count: 100, status: true }));
		dispatch(loadAllProductBrand({ page: 1, count: 100, status: true }));
		dispatch(loadAllColor({}));
	}, [dispatch, id]);

	useEffect(() => {
		if (!loading) {
			setProdDescription(product?.description);
			setProdSubCat(product?.productSubCategoryId);
			setProdBrand(product?.productBrandId);
			const colors = product?.productColor?.map((item) => item.color?.id);

			setSelectedColors(colors);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		loading,
		product?.description,
		product?.productBrandId,
		product?.productSubCategoryId,
	]);

	return (
		<>
			{product ? (
				<Card
					className='border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]'
					bodyStyle={{ padding: 0 }}
					bordered={false}>
					<h1 className='text-lg font-bold text-center my-10'>
						Update Product
					</h1>
					<Form
						form={form}
						name='basic'
						className='mx-40'
						initialValues={{ ...product }}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						autoComplete='off'
						layout='vertical'>
						<Form.Item
							style={{ marginBottom: "15px" }}
							label='Name'
							name='name'>
							<Input />
						</Form.Item>
						<div className='flex items-center gap-2'>
							<Form.Item
								style={{ marginBottom: "15px" }}
								name='productSubCategoryId'
								label='Select Subcategory'
								className='flex-grow'>
								<Select
									name='productSubCategoryId'
									loading={!subCategory}
									showSearch
									placeholder='Select Subcategory'
									optionFilterProp='children'
									filterOption={(input, option) =>
										option.children.includes(input)
									}
									filterSort={(optionA, optionB) =>
										optionA.children
											.toLowerCase()
											.localeCompare(optionB.children.toLowerCase())
									}
									onChange={prodSubCatHandler}>
									{subCategory &&
										subCategory.map((subcat) => (
											<Select.Option key={subcat.id} value={subcat.id}>
												{subcat.name}
											</Select.Option>
										))}
								</Select>
							</Form.Item>
							<BigDrawer
								className={"-mb-[13px]"}
								btnTitle={"Sub Category"}
								title='new Sub-Category'
								children={<AddProductCategory drawer={true} />}
							/>
						</div>
						<div className='flex items-center gap-2'>
							<Form.Item
								style={{ marginBottom: "15px" }}
								className='flex-grow'
								name='productBrandId'
								label='Select Brand'>
								<Select
									name='productBrandId'
									loading={!brand}
									showSearch
									placeholder='Select Brand'
									optionFilterProp='children'
									filterOption={(input, option) =>
										option.children.includes(input)
									}
									filterSort={(optionA, optionB) =>
										optionA.children
											.toLowerCase()
											.localeCompare(optionB.children.toLowerCase())
									}
									onChange={prodBrandHandler}>
									{brand &&
										brand.map((brandSingle) => (
											<Select.Option
												key={brandSingle.id}
												value={brandSingle.id}>
												{brandSingle.name}
											</Select.Option>
										))}
								</Select>
							</Form.Item>
							<BigDrawer
								className={"-mb-[13px]"}
								btnTitle={"Brand"}
								title='new Brand'
								children={<AddProductBrand drawer={true} />}
							/>
						</div>

						<Form.Item
							style={{ marginBottom: "15px" }}
							name='unitType'
							label='Select Unit Type '>
							<Select
								name='unitType'
								loading={!category}
								showSearch
								placeholder='Select Unit Type'
								optionFilterProp='children'
								filterOption={(input, option) =>
									option.children.includes(input)
								}
								filterSort={(optionA, optionB) =>
									optionA.children
										.toLowerCase()
										.localeCompare(optionB.children.toLowerCase())
								}>
								{unitType &&
									unitType.map((unit) => (
										<Select.Option key={unit} value={unit}>
											{unit}
										</Select.Option>
									))}
							</Select>
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "15px" }}
							label='Unit Measurement'
							name='unitMeasurement'>
							<Input type='number' />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "15px" }}
							label='Quantity'
							name='productQuantity'>
							<Input type='number' />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "15px" }}
							label='Purchase Price'
							name='productPurchasePrice'>
							<Input type='number' />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "15px" }}
							label='Sale Price'
							name='productSalePrice'>
							<Input type='number' />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "15px" }}
							label='Reorder Quantity'
							name='reorderQuantity'>
							<Input type='number' />
						</Form.Item>

						{color?.length && (
							<Form.Item
								style={{ marginBottom: "15px" }}
								label='Colors'
								rules={[
									selectedColors?.length === 0 && {
										required: true,
										message: "Please input Color!",
									},
								]}>
								<ColorDropdown
									data={color}
									selectedColors={selectedColors}
									colorsHandler={colorsHandler}
								/>
							</Form.Item>
						)}

						<Form.Item
							label='Upload Thumbnail Image'
							valuePropName='thumbnail_image'>
							<Upload
								listType='picture-card'
								beforeUpload={() => false}
								name='image'
								fileList={thumbFileList}
								maxCount={1}
								onChange={handelThumbImageChange}>
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
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "15px" }}
							label='SKU No'
							name='sku'>
							<Input />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "15px" }}
							label='Product Vat%'
							name='productVat'>
							<Input type='number' placeholder='Enter vat/tax percentage' />
						</Form.Item>

						{/* make a description item in form */}
						<Form.Item
							style={{ marginBottom: "25px" }}
							label='Product Description '>
							<ReactQuill
								value={prodDescription}
								onChange={prodDescriptionHandler}
								modules={textEditorModule}
								formats={textEditorFormats}
							/>
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "15px" }}
							className={styles.addProductBtnContainer}>
							<Button
								type='primary'
								htmlType='submit'
								shape='round'
								loading={loader}>
								Update Product
							</Button>
						</Form.Item>
					</Form>
				</Card>
			) : (
				<Loader />
			)}
		</>
	);
};

export default UpdateProduct;
