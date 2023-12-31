import { Button, Card, Form, Input, InputNumber, Typography } from "antd";

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addVatTax,
  loadAllVatTax,
} from "../../redux/rtk/features/vatTax/vatTaxSlice";

const AddVatTax = ({ drawer }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      const resp = await dispatch(addVatTax(values));
      if (resp.payload.message === "success") {
        setLoading(false);
        form.resetFields();
        dispatch(loadAllVatTax());
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoading(false);
    console.log("Failed:", errorInfo);
  };

  const onClick = () => {
    setLoading(true);
  };

  return (
    <>
      <Card bordered={false} className='criclebox h-full'>
        <Title level={4} className='m-3 text-center'>
          Add Vat/Tax Type
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
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            style={{ marginBottom: "10px" }}
            label='Title'
            name='title'
            rules={[
              {
                required: true,
                message: "Please enter vat/tax type name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label='Percentage'
            name='percentage'
            rules={[
              {
                required: true,
                message: "Please enter vat/tax percentage name!",
              },
            ]}
          >
            <InputNumber className='w-full' />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            className='flex justify-center mt-6'
          >
            <Button
              type='primary'
              htmlType='submit'
              shape='round'
              loading={loading}
              onClick={onClick}
            >
              Add Vat/Tax Type
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default AddVatTax;
