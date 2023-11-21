import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { loadAllVatTax } from "../../redux/rtk/features/vatTax/vatTaxSlice";
import AddPos from "./AddPos";
import ProductsForSale from "./ProductsForSale";

const Pos = (props) => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));
  // Form Function
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [subTotal, setSubTotal] = useState([]);
  const [total, setTotal] = useState(0);
  const [afterDiscount, setAfterDiscount] = useState(0);
  const [afterVatTaxAdded, setAfterVatTaxAdded] = useState(0);
  const [due, setDue] = useState(0);
  const { list: vatTaxList, loading: vatTaxLoading } = useSelector(
    (state) => state.vatTax
  );

  useEffect(() => {
    dispatch(loadAllVatTax());
  }, [dispatch]);
  if (!isLogged) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }
  // total calculate
  const totalCalculator = () => {
    const productArray = form.getFieldValue("saleInvoiceProduct");

    const subTotal =
      productArray?.reduce((subTotal, current) => {
        const quantity = current?.productQuantity || 0;
        const price = current?.productSalePrice || 0;
        const vat = current?.productVat || 0;
        const totalVat = (vat / 100) * price * quantity;

        return [
          ...subTotal,
          {
            subVat: current?.productVat || 0,
            subPrice: price * quantity + totalVat,
          },
        ];
      }, []) || [];

    setSubTotal(subTotal);
    const total =
      subTotal.reduce((total, current) => total + current.subPrice, 0) || 0;

    setTotal(total);

    const afterDiscount = Boolean(total)
      ? total - (form.getFieldValue("discount") || 0) || 0
      : 0;
    setAfterDiscount(afterDiscount);

    // vat tax calculate
    const vatFields = form.getFieldValue("vatId");
    const totalVatArray =
      vatFields?.map((id) => {
        return vatTaxList.find((item) => id === item.id)?.percentage;
      }) || [];
    const TotalTaxVatPercent = totalVatArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const afterVatTaxAdded = afterDiscount + (TotalTaxVatPercent / 100) * total;
    setAfterVatTaxAdded(afterVatTaxAdded);

    //due count
    const due = Boolean(afterVatTaxAdded)
      ? afterVatTaxAdded - (form.getFieldValue("paidAmount") || 0) || 0
      : 0;
    setDue(due);
  };
  return (
    <div>
      <div className='border rounded-lg '>
        <div className='flex flex-col lg:flex-row gap-5'>
          <div className='xl:w-3/5  lg:w-1/2 p-5 bg-[#F1F1F1]'>
            <ProductsForSale form={form} totalCalculator={totalCalculator} />
          </div>
          <div className='lg:w-1/2 xl:w-2/5 p-5'>
            <AddPos
              form={form}
              total={total}
              totalCalculator={totalCalculator}
              subTotal={subTotal}
              afterDiscount={afterDiscount}
              afterVatTaxAdded={afterVatTaxAdded}
              due={due}
              vatTaxList={vatTaxList}
              vatTaxLoading={vatTaxLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pos;
