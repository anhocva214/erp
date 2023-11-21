import { Alert, Button, Card, Col, Form, Input, Row, Typography } from "antd";

import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  addCustomer,
  loadAllCustomer,
} from "../../redux/rtk/features/customer/customerSlice";
import styles from "./AddCust.module.css";

const AddCust = ({ drawer }) => {
  const dispatch = useDispatch();
  const { Title } = Typography;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  //check the page url has customer on it or not
  const isAdmin = window.location.href.includes("admin");

  const onClick = () => {
    setLoading(true);
  };

  const onFinish = async (values) => {
    try {
      const resp = await dispatch(addCustomer(values));
      if (resp.payload?.message === "success") {
        setSuccess(true);
        form.resetFields();
        dispatch(loadAllCustomer({ page: 1, count: 10, status: true }));
        //redirect to customer login page
        // wait for 5 sec and then redirect to home
        if (isAdmin !== true) {
          setTimeout(() => {
            window.location.href = "/customer/login";
            setSuccess(false);
            setLoading(false);
          }, 5000);
        } else {
          setSuccess(false);
          setLoading(false);
        }
      } else {
        setLoading(false);
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
    <Fragment>
      <Row className='mr-top flex justify-center' gutter={[0, 30]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={drawer ? 22 : 11}
          xl={drawer ? 22 : 11}
          className='rounded column-design '
        >
          <Card
            bordered={false}
            className={
              isAdmin !== true
                ? "border-solid border-2 border-black-300 mt-[5rem]"
                : ""
            }
          >
            {success && (
              <Alert
                message='We have sent you an email with password .'
                description='Please check your email and login to your account.'
                type='success'
                showIcon
              />
            )}
            <Title level={4} className='m-2 text-center'>
              Register Now
            </Title>
            <Form
              form={form}
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
                    message: "Please input  name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label='Email'
                name='email'
                rules={[
                  {
                    required: true,
                    message: "Please input  email!",
                  },
                ]}
              >
                <Input type='email' />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "10px" }}
                label='Phone'
                name='phone'
                rules={[
                  {
                    required: true,
                    message: "Please input Phone!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              {/* <Form.Item
                style={{ marginBottom: "10px" }}
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input  password!",
                  },
                ]}>
                <Input type="password" />
              </Form.Item>

               Customer due droped */}

              <Form.Item
                style={{ marginBottom: "10px" }}
                className={styles.addCustomerBtnContainer}
              >
                <Button
                  onClick={onClick}
                  loading={loading}
                  type='primary'
                  htmlType='submit'
                  shape='round'
                >
                  Register Now
                </Button>
              </Form.Item>
            </Form>
            {!isAdmin && (
              <Title className='mt-5 mb-5 text-center text-base'>
                Already have an account?{" "}
                <Link to='/customer/login'>Login Now</Link>
              </Title>
            )}
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddCust;
