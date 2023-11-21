import { Card, Col, Form, Input, Pagination, Row, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getTotalProduct from "../../api/getAllApis/getTotalProduct";
import {
	loadPosProduct,
	loadProduct,
} from "../../redux/rtk/features/product/productSlice";
import {
	loadAllProductSubCategory,
	loadSingleProductSubCategory,
} from "../../redux/rtk/features/productSubCategory/productSubCategorySlice";
import { stringShorter } from "../../utils/functions";
import "./pos.css";

export default function ProductsForSale({ form: MainForm, totalCalculator }) {
	const dispatch = useDispatch();
	const list = useSelector((state) => state.products.list);
	const { list: subCategory } =
		useSelector((state) => state.productSubCategories) || {};
	const [loading, setLoading] = useState(false);

	const [finalSubCat, setfinalSubCat] = useState([]);

	useEffect(() => {
		const subCategoryToGetAllProd = {
			id: 0,
			name: "all products",
		};
		if (subCategory !== null) {
			setfinalSubCat([subCategoryToGetAllProd, ...subCategory]);
		}
	}, [subCategory]);

	const subCategoryProd = useSelector(
		(state) => state.productSubCategories?.subCategory?.product
	);

	const [totalProd, setTotalProd] = useState(0);
	const [prodList, setProdList] = useState(null);

	useEffect(() => {
		dispatch(loadProduct({ status: "true", page: 1, count: 10 }));
		dispatch(loadAllProductSubCategory({ page: 1, count: 100, status: true }));
	}, [dispatch]);

	useEffect(() => {
		setProdList(list);
	}, [list]);

	useEffect(() => {
		getTotalProduct().then((res) => setTotalProd(res));
	}, [list]);

	const handleSubCatChange = (catId) => {
		if (catId === 0) {
			dispatch(loadAllProductSubCategory({ page: 1, count: 100 }));
			setProdList(list);
		} else {
			dispatch(loadSingleProductSubCategory(catId));
			setProdList(null);
		}
	};

	const [status, setStatus] = useState("true");

	const onShowSizeChange = (current, pageSize) => {};

	const handleSelectedProds = (item) => {
		const productArray = MainForm.getFieldValue("saleInvoiceProduct") || [];
		const findProduct = productArray.find((pro) => pro.productId === item.id);
		if (!findProduct) {
			MainForm.setFieldsValue({
				saleInvoiceProduct: [
					...productArray,
					{
						productId: item.id,
						productSalePrice: item.productSalePrice,
						productQuantity: !!item.productQuantity ? 1 : 0,
						productName: item.name,
						productVat: !!item.productVat ? item.productVat : 0,
						unitMeasurement: item?.unitMeasurement,
					},
				],
			});
			totalCalculator();
		}
	};

	const Products = ({ item, index }) => {
		const handleOnError = (e) => {
			e.target.src = "/images/default.jpg";
		};
		return (
			<Col span={24} sm={12} lg={24} xl={12} key={index}>
				<Card
					hoverable
					style={{
						width: "100%",
						border: "none",
						height: "120px",
					}}
					bodyStyle={{ backgroundColor: "white" }}
					className='pos-product-card hover:bg-white overflow-hidden'
					onClick={() => {
						handleSelectedProds(item);
					}}>
					<div className='flex items-center gap-2'>
						<div className='w-[80px] h-[44px] relative'>
							<img
								alt='example'
								className='absolute object-cover w-full h-full'
								src={item.thumbnailImageUrl}
								onError={handleOnError}
								style={{ width: "100%", height: "auto" }}
							/>
						</div>
						<div className='w-50 flex-grow-1'>
							<p className='font-bold mb-0'>{stringShorter(item.name, 20)}</p>
							<p className='mb-0' style={{ fontSize: "12px" }}>
								Price : {item.productSalePrice}
							</p>
							<p className='mb-0' style={{ fontSize: "12px" }}>
								QTY: {item.productQuantity}
							</p>
							<p style={{ fontSize: "12px" }}>
								{" "}
								SKU : {stringShorter(item.sku, 23)}
							</p>
						</div>
						<br />
					</div>
				</Card>
			</Col>
		);
	};

	// Single Product Search Function
	const [form] = Form.useForm();

	const onFinish = async (values) => {
		const resp = await dispatch(loadPosProduct(values.s_id));

		if (values.s_id === undefined) {
			setLoading(false);
			dispatch(loadProduct({ status: "true", page: 1, count: 10 }));
		}
		if (resp.payload.status === "success") {
			setProdList(resp.payload.data);
			form.resetFields();
			setLoading(false);
		}
	};
	const onFinishFailed = (errorInfo) => {
		setLoading(false);
		console.log("Failed:", errorInfo);
	};

	return (
		<>
			<div className='flex flex-col md:flex-row lg:flex-col xl:flex-row justify-around items-center gap-3'>
				<div className='mt-4 order-last  md:order-1 lg:order-last xl:order-1'>
					<Form
						form={form}
						layout='inline'
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						autoComplete='off'>
						<Form.Item name='s_id'>
							<Input placeholder='Search Product' />
						</Form.Item>

						<Form.Item>
							<button
								onClick={() => setLoading(true)}
								className='bg-[#1890ff] rounded-md text-white px-3 py-[5px]'
								type='submit'
								htmlType='submit'>
								Search
							</button>
						</Form.Item>
					</Form>
				</div>

				<div className='mt-4'>
					<Select
						name='productSubCategoryId'
						loading={!subCategory}
						showSearch
						style={{
							width: 200,
						}}
						onChange={handleSubCatChange}
						placeholder='Select Subcategory'
						optionFilterProp='children'
						filterOption={(input, option) => option.children.includes(input)}
						filterSort={(optionA, optionB) =>
							optionA.children
								.toLowerCase()
								.localeCompare(optionB.children.toLowerCase())
						}>
						{finalSubCat &&
							finalSubCat.map((subcat) => (
								<Select.Option key={subcat.id} value={subcat.id}>
									{subcat.name}
								</Select.Option>
							))}
					</Select>
				</div>
			</div>
			<Row className='mt-4' gutter={[20, 20]}>
				{prodList ? (
					prodList.map((item, index) => (
						<Products key={index} index={index} item={item} />
					))
				) : subCategoryProd ? (
					subCategoryProd.map((item, index) => (
						<Products key={index} index={index} item={item} />
					))
				) : (
					<div className='w-100 flex justify-center items-center'>
						<Spin size='large' />
					</div>
				)}
			</Row>

			{totalProd > 10 && (
				<div className='mt-5'>
					<Pagination
						showSizeChanger
						onChange={(page, count) => {
							dispatch(loadProduct({ page, count: count, status }));
						}}
						onShowSizeChange={onShowSizeChange}
						defaultCurrent={1}
						total={totalProd}
					/>
				</div>
			)}
		</>
	);
}
