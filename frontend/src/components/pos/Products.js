import { DeleteOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber } from "antd";
import "./products.css";

export default function Products({ totalCalculator, subTotal }) {
  return (
    <div className='products-container-wrapper my-3'>
      <div className='products-container'>
        <div className='grid grid-cols-12 gap-2'>
          <div className='col-span-1 font-weight-bold '>SL</div>
          <div className='col-span-3 md:col-span-4 lg:col-span-3 3xl:col-span-4 font-weight-bold'>
            Product
          </div>
          <div className='col-span-1 font-weight-bold'>U.M </div>
          <div className='col-span-2 font-weight-bold'>QTY </div>

          <div className='col-span-1 font-weight-bold'>U.Price</div>
          <div className='col-span-1 font-weight-bold'>Vat</div>
          <div className='col-span-1 font-weight-bold'>Total</div>
          <div className='col-span-1'>Delete</div>
        </div>

        <hr style={{ backgroundColor: "black", marginTop: "0.5rem" }} />

        <Form.List
          name='saleInvoiceProduct'
          rules={[
            {
              required: true,
              message: "Product is required",
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <div className='grid grid-cols-12 gap-2 my-3'>
                  <div className='col-span-1 flex items-center'>
                    {index + 1}
                  </div>
                  <div className='col-span-3 md:col-span-4 lg:col-span-3 3xl:col-span-4'>
                    <Form.Item {...restField} name={[name, "productName"]}>
                      <Input disabled />
                    </Form.Item>
                  </div>

                  <div className='col-span-1'>
                    <Form.Item {...restField} name={[name, "unitMeasurement"]}>
                      <InputNumber
                        style={{ width: "100%" }}
                        size={"small"}
                        disabled
                        placeholder='U.M'
                      />
                    </Form.Item>
                  </div>
                  <div className='col-span-2'>
                    <Form.Item
                      {...restField}
                      name={[name, "productQuantity"]}
                      rules={[
                        {
                          required: true,
                          message: "quantity is required",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        size={"small"}
                        placeholder='Quantity'
                        onChange={() => totalCalculator(index)}
                      />
                    </Form.Item>
                  </div>
                  <div className='col-span-1'>
                    <Form.Item
                      {...restField}
                      name={[name, "productSalePrice"]}
                      rules={[
                        {
                          required: true,
                          message: "Price is required",
                        },
                      ]}
                    >
                      <InputNumber
                        size='small'
                        style={{ width: "100%" }}
                        placeholder='50000'
                        onChange={() => totalCalculator(index)}
                      />
                    </Form.Item>
                  </div>
                  <div className='col-span-1'>
                    <div className='font-weight-bold totalMargin'>
                      {subTotal[index]?.subVat || 0}%
                    </div>
                  </div>
                  <div className='col-span-1'>
                    <div className='font-weight-bold totalMargin'>
                      {subTotal[index]?.subPrice?.toFixed(2) || 0}
                    </div>
                  </div>
                  <div className='col-span-1'>
                    <Form.Item>
                      <button
                        shape='circle'
                        className='flex justify-center items-center bg-red-600 text-white p-2 rounded-md'
                        onClick={() => {
                          remove(name);
                          totalCalculator(index);
                        }}
                      >
                        <DeleteOutlined className='' />
                      </button>
                    </Form.Item>
                  </div>
                </div>
              ))}
            </>
          )}
        </Form.List>
      </div>
    </div>
  );
}
