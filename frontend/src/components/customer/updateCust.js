import { Alert, Button, Col, Form, Input, Row, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

//Update customer API REQ
export const updateCustomer = async (id, values) => {
  try {
    await axios({
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `customer/${id}`,
      data: {
        ...values,
      },
    });
    return "success";
    // return data;
  } catch (error) {
    console.log(error.message);
  }
};

function UpdateCust() {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const { id } = useParams();

  //Loading Old data from URL
  const location = useLocation();
  const { data } = location.state;

  const cust = data;
  const [initValues, setInitValues] = useState({
    name: cust.name,
    phone: cust.phone,
    address: cust.address,
    dueAmount: cust.dueAmount,
  });

  const onFinish = (values) => {
    try {
      updateCustomer(id, values);
      setSuccess(true);
      toast.success("Customer details is updated");
      setInitValues({});
    } catch (error) {
      console.log(error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <div className='text-center'>
        <div className=''>
          <Row className='mr-top'>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={14}
              className='border rounded column-design'
            >
              {success && (
                <div>
                  <Alert
                    message={`customer details updated successfully`}
                    type='success'
                    closable={true}
                    showIcon
                  />
                </div>
              )}
              <Title level={3} className='m-4 text-center'>
                Edit Customer Form
              </Title>
              <Form
                initialValues={{
                  ...initValues,
                }}
                form={form}
                className='m-6'
                name='basic'
                labelCol={{
                  span: 5,
                }}
                wrapperCol={{
                  span: 16,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete='off'
              >
                <Form.Item
                  style={{ marginBottom: "10px" }}
                  fields={[{ name: "Name" }]}
                  label='Name'
                  name='name'
                  rules={[
                    {
                      required: true,
                      message: "Please input customer name!",
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
                      message: "Please input customer Phone!",
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
                      message: "Please input customer Address!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{ marginBottom: "10px" }}
                  wrapperCol={{
                    offset: 5,
                    span: 16,
                  }}
                >
                  <Button block type='primary' htmlType='submit' shape='round'>
                    Update Now
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default UpdateCust;
