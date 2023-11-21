import { Button, Card, Form, Input, Typography } from "antd";
import styles from "./AddProdCat.module.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProductCategory } from "../../redux/rtk/features/productCategory/productCategorySlice";
import UploadMany from "../Card/UploadMany";

const AddProductCategory = () => {
  const dispatch = useDispatch();
  const { Title } = Typography;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onClick = () => {
    setLoading(true);
  };

  const onFinish = async (values) => {
    try {
      const resp = await dispatch(addProductCategory(values));

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

  return (
    <>
      <Card bordered={false} className='criclebox h-full'>
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
                message: "Please input category Dname!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            className={styles.addProdCatBtnContainer}
          >
            <Button
              loading={loading}
              type='primary'
              htmlType='submit'
              shape='round'
              onClick={onClick}
            >
              Add Category
            </Button>
          </Form.Item>
        </Form>
        <Title level={4} className='m-2 mt-10 text-center border-t'>
          Import From CSV
        </Title>
        <UploadMany urlPath={"category"} />
      </Card>
    </>
  );
};

export default AddProductCategory;
