import { Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { addSupplier } from "../../redux/rtk/features/supplier/supplierSlice";
import UploadMany from "../Card/UploadMany";
import styles from "./AddSup.module.css";

const AddSup = ({ drawer }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onClick = () => {
    setLoading(true);
  };
  const onFinish = async (values) => {
    try {
      const resp = await dispatch(addSupplier(values));
      if (resp.payload.message === "success") {
        form.resetFields();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setLoading(false);
  };

  return (
    <>
      <Card bordered={false}>
        <Title level={4} className='m-2 text-center'>
          Add Supplier
        </Title>
        <Form
          form={form}
          name='basic'
          labelCol={{
            span: 5,
          }}
          labelWrap
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            style={{ marginBottom: "10px" }}
            label='Name'
            name='name'
            rules={[
              {
                required: true,
                message: "Please input supplier name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label='Phone'
            name='phone'
            rules={[
              {
                required: true,
                message: "Please input supplier Phone!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            label='Address'
            name='address'
            rules={[
              {
                required: true,
                message: "Please input supplier Address!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* //Due amount droped */}

          <Form.Item
            style={{ marginBottom: "10px" }}
            className={styles.addSupplierBtnContainer}
          >
            <Button
              loading={loading}
              type='primary'
              htmlType='submit'
              shape='round'
              onClick={onClick}
            >
              Add Supplier
            </Button>
          </Form.Item>
        </Form>
        <Card bordered={false} className={styles.importCsvCard}>
          <Title level={4} className='m-2 text-center'>
            Import From CSV
          </Title>
          <UploadMany urlPath={"supplier"} />
        </Card>
      </Card>
    </>
  );
};

export default AddSup;
