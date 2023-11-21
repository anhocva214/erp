import { Button, DatePicker, Form, InputNumber, Select } from "antd";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllCustomer } from "../../redux/rtk/features/customer/customerSlice";
import Products from "./Products";

import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addSale } from "../../redux/rtk/features/sale/saleSlice";
import { loadAllVatTax } from "../../redux/rtk/features/vatTax/vatTaxSlice";
import BigDrawer from "../Drawer/BigDrawer";
import AddCust from "../customer/addCust";

const AddPos = ({
  form,
  total,
  subTotal,
  afterDiscount,
  afterVatTaxAdded,
  totalCalculator,
  due,
  vatTaxList,
  vatTaxLoading,
}) => {
  const { Option } = Select;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allCustomer = useSelector((state) => state.customers.list);

  // validation handlers
  const validatePaidAmount = (_, value) => {
    if (value >= afterVatTaxAdded) {
      return Promise.resolve();
    }
    return Promise.reject(
      `Paid amount must be gater than or equal ${afterVatTaxAdded}`
    );
  };
  const validateDiscount = (_, value) => {
    if (value >= 0 && value <= total) {
      return Promise.resolve();
    }
    return Promise.reject(`Discount must be gater than or equal ${total}`);
  };

  //get id from local storage
  const userId = localStorage.getItem("id");

  const onFormSubmit = async (values) => {
    try {
      const products = values.saleInvoiceProduct.map((product) => {
        return {
          productId: product.productId,
          productSalePrice: product.productSalePrice,
          productQuantity: product.productQuantity,
        };
      });

      const data = {
        ...values,
        paidAmount: afterVatTaxAdded,
        saleInvoiceProduct: products,
        userId: parseInt(userId),
      };
      const resp = await dispatch(addSale(data));

      if (resp.payload.message === "success") {
        form.resetFields();
        navigate(`/admin/sale/${resp.payload.createdInvoiceId}`);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Error while sales");
    }
  };

  useEffect(() => {
    dispatch(loadAllVatTax());
    dispatch(loadAllCustomer({ page: 1, count: 10 }));
  }, [dispatch]);

  return (
    <Form
      form={form}
      className='m-lg-1'
      onFinish={onFormSubmit}
      name='dynamic_form_nest_item'
      initialValues={{ discount: 0, date: dayjs(), paidAmount: 0, vatId: [] }}
      layout='vertical'
      size='large'
      autoComplete='off'
    >
      <div className='flex flex-col 3xl:flex-row justify-between gap-2'>
        <div className='3xl:w-1/2 flex items-center'>
          <Form.Item
            label='Customer'
            className='flex-grow'
            name='customerId'
            style={{ maxWidth: "250px" }}
            rules={[
              {
                required: true,
                message: "Please Select a Customer!",
              },
            ]}
          >
            <Select
              loading={!allCustomer}
              showSearch
              placeholder='Select a customer '
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {allCustomer &&
                allCustomer.map((cust) => (
                  <Option key={cust.id} value={cust.id}>
                    {cust.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <BigDrawer
            className={"-mb-[46px]"}
            title={"new Customer"}
            btnTitle={"New"}
            children={<AddCust drawer={true} />}
          />
        </div>
        <div className='3xl:w-1/2'>
          <Form.Item
            label='Date'
            name='date'
            rules={[
              {
                required: true,
                message: "Please input Date!",
              },
            ]}
            required
          >
            <DatePicker />
          </Form.Item>
        </div>
      </div>

      <div
        style={{
          padding: "10px 0px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Total: </span>
        <span>{total.toFixed(2)} tk</span>
      </div>
      <div
        style={{
          padding: "10px 0px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Discount: </span>
        <Form.Item
          className='w-1/2'
          name='discount'
          rules={[
            {
              validator: validateDiscount,
            },
          ]}
        >
          <InputNumber onChange={() => totalCalculator()} defaultValue={0} />
        </Form.Item>
      </div>
      <div
        style={{
          padding: "10px 0px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>After Discount: </span>
        <span>{afterDiscount.toFixed(2)} tk</span>
      </div>
      <div
        className='flex justify-between'
        style={{
          padding: "10px 0px",
          alignItems: "center",
        }}
      >
        <span className=''>Vat/Tax: </span>
        <Form.Item className='w-1/2' name='vatId'>
          <Select
            mode='multiple'
            placeholder='Select Vat/Tax type'
            maxTagCount={5}
            showArrow
            loading={vatTaxLoading}
            onChange={() => totalCalculator()}
          >
            {vatTaxList?.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.title}
                <span className='italic'>@{item.percentage}%</span>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div
        style={{
          padding: "10px 0px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <strong>Paid Amount: </strong>
        <strong>{afterVatTaxAdded.toFixed(2)} tk</strong>
      </div>
      <div
        className='flex justify-between'
        style={{
          padding: "10px 0px",
          alignItems: "center",
        }}
      >
        <span>Given Amount: </span>
        <Form.Item
          name='paidAmount'
          rules={[
            {
              required: true,
              message: "Given amount is required",
            },
            {
              validator: validatePaidAmount,
            },
          ]}
          className='w-1/2'
        >
          <InputNumber onChange={() => totalCalculator()} defaultValue={0} />
        </Form.Item>
      </div>
      <div
        style={{
          padding: "10px 0px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <strong>Return Amount: </strong>
        <strong>{due.toFixed(2)} tk</strong>
      </div>

      <Products
        subTotal={subTotal}
        form={form}
        totalCalculator={totalCalculator}
      />

      <Form.Item>
        <Button block type='primary' htmlType='submit'>
          Sale Product
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddPos;
