import { Button } from "antd";
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
import numberToWords from "../../utils/numberToWords";
import "./style.css";

const PrintToPdf = forwardRef(({ data, invoiceData, vatAmount }, ref) => {
	return (
		<Fragment>
			<div ref={ref} className='wrapper'>
				<div className='box2'>
					<h1 className='text-2xl font-semibold'>{invoiceData?.companyName}</h1>
					<h3 className='text-base font-medium'>{invoiceData?.tagLine}</h3>
					<p>{invoiceData?.address}</p>
					<p>{invoiceData?.phone}</p>
					<p>Email: {invoiceData?.email}</p>
					<p>Website: {invoiceData?.website}</p>
				</div>

				<div className='box4'>
					<hr className='hr1' />
					<h3 className='center font-medium'>SALE INVOICE</h3>
					<hr className='hr1' />
				</div>

				<div className='box4'>
					<hr className='hr1' />
					<h3 className='center font-medium'>SALE INVOICE</h3>
					<hr className='hr1' />
				</div>

				<div className='box5'>
					<table className='table2'>
						<tr>
							<th>Client ID</th>
							<td>{data?.customerId}</td>
						</tr>
						<tr>
							<th>Client Name</th>
							<td>{data?.customer.name}</td>
						</tr>
						<tr>
							<th>Address</th>
							<td>{data?.customer.address}</td>
						</tr>
						<tr>
							<th>Contact No</th>
							<td>{data?.customer.phone}</td>
						</tr>
					</table>
				</div>

				<div className='box6'>
					<table className='table2'>
						<tr>
							<th>Invoice No</th>
							<td>{data?.id}</td>
						</tr>
						<tr>
							<th>Invoice Date</th>
							<td>{moment(data?.date).format("YYYY-MM-DD")}</td>
						</tr>
					</table>
				</div>

				<div className='box7'>
					<table className='table1'>
						<thead>
							<th>Sl</th>
							<th>Product Description</th>
							<th>Quantity</th>
							<th>Unit Price</th>
							<th>Total Price</th>
						</thead>
						<tbody>
							{data &&
								data.saleInvoiceProduct.map((d) => (
									<tr key={d.id}>
										<td>{d.id}</td>
										<td>
											<p>{d.product.name}</p>
										</td>
										<td>{d.productQuantity}</td>
										<td>{d.productSalePrice}</td>
										<td>{d.productQuantity * d.productSalePrice}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>

				<div className='box9'>
					<table className='table2'>
						<tr>
							<th> Total</th>
							<td>{data.totalAmount - vatAmount}</td>
						</tr>
						<tr>
							<th>VAT / TAX </th>
							<td>{vatAmount}</td>
						</tr>
						<tr>
							<th>Sub total</th>
							<td>{data.totalAmount}</td>
						</tr>
						<tr>
							<th>Discount (-)</th>
							<td>{data.discount}</td>
						</tr>
						<tr>
							<th>Grand total</th>
							<td>{data.totalAmount - data.discount}</td>
						</tr>
						<tr>
							<th>Paid</th>
							<td>{data.paidAmount}</td>
						</tr>
						<tr>
							<th>Due</th>
							<td>{data.dueAmount}</td>
						</tr>
					</table>
				</div>

				<div className='box10'>
					<hr />
					<p>Received By</p>
				</div>

				<div className='box11'>
					<hr />
					<p>Authorized By</p>
				</div>

				<div className='box12'>
					<hr />
					<p>Powered by ERP-OS | Contact: 01885 996601</p>
				</div>

				<div className='box13'>
					<p>
						<b>In Words: </b>
						{numberToWords(data.totalAmount - data.discount)}
					</p>
				</div>
			</div>
		</Fragment>
	);
});

const SaleInvoice = ({ data, vatAmount }) => {
	const componentRef = useRef();
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	const [invoiceData, setInvoiceData] = useState(null);
	useEffect(() => {
		getSetting().then((data) => setInvoiceData(data.result));
	}, []);

	return (
		<div>
			<div className='hidden'>
				<PrintToPdf
					ref={componentRef}
					data={data}
					invoiceData={invoiceData}
					vatAmount={vatAmount}
				/>
			</div>
			{invoiceData && (
				<Button type='primary' shape='round' onClick={handlePrint}>
					Print PDF
				</Button>
			)}
		</div>
	);
};

export default SaleInvoice;
