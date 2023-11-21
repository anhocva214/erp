import moment from "moment";
import React, {
	forwardRef,
	Fragment,
	useEffect,
	useRef,
	useState,
} from "react";
import { useReactToPrint } from "react-to-print";
import getSetting from "../../api/getSettings";
import { PrintAllBtn } from "../UI/CsvLinkBtn";

import "./saleReport.module.css";

const PrintToPdf = forwardRef(
	({ data, settingData, date, user, total }, ref) => {
		// make the sum of all the discount in the data array
		const totalDiscount = data?.reduce((acc, item) => {
			return acc + item?.discount;
		}, 0);

		return (
			<Fragment>
				<div ref={ref} className='wrapper'>
					<div className='box2'>
						<h1>{settingData?.companyName}</h1>
						<h3>{settingData?.tagLine}</h3>
						<p>{settingData?.address}</p>
						<p>{settingData?.phone}</p>
						<p>Email: {settingData?.email}</p>
						<p>Website: {settingData?.website}</p>
					</div>
					<div className='box4'>
						<hr className='hr1' />
						<h3 className='center'>SALES REPORT</h3>
						<hr className='hr1' />
					</div>

					<div className='box5'>
						<table className='table2'>
							<tr>
								<th>Type</th>
								<td>All</td>
							</tr>
							<tr>
								<th>Sales Person</th>
								<td>{user ? data[0]?.user?.username : "All"} </td>
							</tr>
						</table>
					</div>

					<div className='box6'>
						<table className='table2'>
							<tr>
								<th>From Date</th>
								<td>{date?.startdate}</td>
							</tr>
							<tr>
								<th>To Date</th>
								<td>{date?.enddate}</td>
							</tr>
						</table>
					</div>

					<div className='box7'>
						<table className='table1'>
							<thead>
								<th>Date</th>
								<th>Invoice</th>
								<th>Staff</th>
								<th>Customer</th>
								<th>Product</th>
								<th>Qty</th>
								<th>U.M</th>
								<th>U.T</th>
								<th>Total</th>
								<th>S Total</th>
								<th>Discount</th>
								<th>G Total</th>
								<th>Paid</th>
								<th>Due</th>
							</thead>
							<tbody>
								{data &&
									data?.map((i) => (
										<tr>
											<td>{moment(i?.date).format("ll")}</td>
											<td>
												<p>{i.id}</p>
											</td>
											<td>{i.user?.username}</td>
											<td>{i.customer?.name}</td>
											<td>
												{i?.saleInvoiceProduct?.map((s) => (
													<p>{s.product?.name}</p>
												))}
											</td>
											<td>
												{i?.saleInvoiceProduct?.map((s) => (
													<p>{s?.productQuantity}</p>
												))}
											</td>
											<td>
												{i?.saleInvoiceProduct?.map((s) => (
													<p>{s?.product?.unitMeasurement}</p>
												))}
											</td>
											<td>
												{i?.saleInvoiceProduct?.map((s) => (
													<p>{s?.product?.unitType}</p>
												))}
											</td>
											<td>
												{i?.saleInvoiceProduct?.map((s) => (
													<p>{s?.productQuantity * s?.productSalePrice}</p>
												))}
											</td>
											<td>{i.totalAmount}</td>
											<td>{i.discount}</td>
											<td>{i.totalAmount - i.discount}</td>
											<td>{i.paidAmount}</td>
											<td>{i.dueAmount}</td>
										</tr>
									))}

								<tr className='font-weight-bold'>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td>{total?.totalUnitQuantity}</td>
									<td>{total?.totalUnitMeasurement}</td>
									<td></td>
									<td></td>
									<td>{total?.totalAmount}</td>
									<td>{totalDiscount}</td>
									<td>{total?.totalAmount - totalDiscount}</td>
									<td>{total?.paidAmount}</td>
									<td>{total?.dueAmount}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className='box12'>
						<hr />
						<p>Powered by OMEGA SOLUTION | Contact: 01885 996601</p>
					</div>
				</div>
			</Fragment>
		);
	}
);

const SaleReportPrint = ({ data, date, user, total }) => {
	const componentRef = useRef();
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	const [settingData, setsettingData] = useState(null);
	useEffect(() => {
		getSetting().then((data) => setsettingData(data.result));
	}, []);

	return (
		<div>
			{data && (
				<div className='hidden'>
					<PrintToPdf
						ref={componentRef}
						data={data}
						settingData={settingData}
						date={date}
						user={user}
						total={total}
					/>
				</div>
			)}
			{settingData && (
				<PrintAllBtn className='w-full mx-0 md:py-2 text-center'>
					<button onClick={handlePrint}>Print PDF</button>
				</PrintAllBtn>
			)}
		</div>
	);
};

export default SaleReportPrint;
