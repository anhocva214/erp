import { Button, Card, Form, Input, Typography } from "antd";
import styles from "./AddProdBrand.module.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProductBrand } from "../../redux/rtk/features/productBrand/productBrandSlice";
import UploadMany from "../Card/UploadMany";

const AddProductBrand = ({ drawer }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      const resp = await dispatch(addProductBrand(values));

      if (resp.payload.message === "success") {
        setLoading(false);
        form.resetFields();
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
          Add Product Brand
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
          autoComplete='off'
        >
          <Form.Item
            style={{ marginBottom: "10px" }}
            label='Name'
            name='name'
            rules={[
              {
                required: true,
                message: "Please input category name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            className={styles.addProdBrandBtnContainer}
          >
            <Button
              type='primary'
              htmlType='submit'
              shape='round'
              loading={loading}
              onClick={onClick}
            >
              Add Brand
            </Button>
          </Form.Item>
        </Form>
        <Card bordered={false} className={styles.importCsvCard}>
          <Title level={4} className='m-2 text-center'>
            Import From CSV
          </Title>
          <UploadMany urlPath={"brand"} />
        </Card>
      </Card>
    </>
  );
};

export default AddProductBrand;
