import { EditOutlined } from "@ant-design/icons";
import { Alert, Button, ColorPicker, Form, Input, Modal } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loadColorPaginated } from "../../redux/rtk/features/color/colorSlice";

//Update Category API REQ
const updateColor = async (id, values) => {
  try {
    await axios({
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `product-colors/${id}`,
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

function UpdateProductColor({ data, id }) {
  const dispatch = useDispatch();
  //Loading Old data from URL
  const { name, colorCode } = data;
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const [updatedColorCode, setUpdatedColorCode] = useState(colorCode);

  const [initValues, setInitValues] = useState({
    name: name,
    colorCode: colorCode,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    const data = { ...values, colorCode: updatedColorCode };
    try {
      const resp = await updateColor(id, data);

      if (resp === "success") {
        setSuccess(true);
        toast.success("color details is updated");
        form.resetFields();
        dispatch(loadColorPaginated({}));
        setIsModalOpen(false);
        setSuccess(false);
        setInitValues({
          name: values.name,
          colorCode: updatedColorCode,
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
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
      <EditOutlined
        onClick={showModal}
        className='bg-gray-600 p-2 text-white rounded-md'
        style={{ fontSize: "15px" }}
      />

      <Modal
        title='Edit Color'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        {success && (
          <div>
            <Alert
              message={`Color details updated successfully`}
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
                message: "Please input Color name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "10px" }}
            label='Color Code'
            required
          >
            <ColorPicker
              showText
              format='hex'
              defaultValue={initValues.colorCode}
              onChange={(code) => {
                setUpdatedColorCode(code.toHexString());
              }}
              presets={[
                {
                  label: "Recommended",
                  colors: [
                    "#000000",
                    "#000000E0",
                    "#000000A6",
                    "#00000073",
                    "#00000040",
                    "#00000026",
                    "#0000001A",
                    "#00000012",
                    "#0000000A",
                    "#00000005",
                    "#F5222D",
                    "#FA8C16",
                    "#FADB14",
                    "#8BBB11",
                    "#52C41A",
                    "#13A8A8",
                    "#1677FF",
                    "#2F54EB",
                    "#722ED1",
                    "#EB2F96",
                    "#F5222D4D",
                    "#FA8C164D",
                    "#FADB144D",
                    "#8BBB114D",
                    "#52C41A4D",
                    "#13A8A84D",
                    "#1677FF4D",
                    "#2F54EB4D",
                    "#722ED14D",
                    "#EB2F964D",
                  ],
                },
                {
                  label: "Recent",
                  colors: [],
                },
              ]}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "10px" }}>
            <Button block type='primary' htmlType='submit' shape='round'>
              Update Now
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateProductColor;
