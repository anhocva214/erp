import { Alert, Button, Form, Input } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { loadSingleProductCategory } from "../../redux/rtk/features/productCategory/productCategorySlice";

//Update Category API REQ
const updateProductCategory = async (id, values) => {
  try {
    await axios({
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `product-category/${id}`,
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

function UpdateProductCategory({ category }) {
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [initValues, setInitValues] = useState({
    name: category.name,
  });

  const onFinish = (values) => {
    try {
      updateProductCategory(id, values);
      setSuccess(true);
      toast.success("category details is updated");
      setInitValues({});
      dispatch(loadSingleProductCategory(id));
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
          {success && (
            <div>
              <Alert
                message={`Category details updated successfully`}
                type='success'
                closable={true}
                showIcon
              />
            </div>
          )}

          <Form
            initialValues={{
              ...initValues,
            }}
            form={form}
            className='m-4'
            name='basic'
            layout='vertical'
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
                  message: "Please input Category name!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item style={{ marginBottom: "10px" }}>
              <Button block type='primary' htmlType='submit' shape='round'>
                Update Now
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

export default UpdateProductCategory;
