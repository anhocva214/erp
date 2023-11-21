import { Button, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addDesignation } from "../../redux/rtk/features/designation/designationSlice";
import UploadMany from "../Card/UploadMany";
import CreateDrawer from "../CommonUi/CreateDrawer";

const AddDesignation = () => {
  const dispatch = useDispatch();
  const { Title } = Typography;

  const [loader, setLoader] = useState(false);
  const onClickLoading = () => {
    setLoader(true);
  };

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const resp = await dispatch(addDesignation(values));
      if (resp.payload.message === "success") {
        setLoader(false);
        form.resetFields();
      }
    } catch (error) {
      setLoader(false);
      console.log(error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoader(false);
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <CreateDrawer
        permission={"create-designation"}
        title={"Create Designation"}
        width={50}
      >
        <div className='flex justify-center mt-5'>
          <Form
            className='w-4/5'
            form={form}
            name='basic'
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
            layout='vertical'
          >
            <Form.Item
              style={{ marginBottom: "10px" }}
              label='Name'
              name='name'
              rules={[
                {
                  required: true,
                  message: "Please input designation name!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item style={{ marginBottom: "10px" }}>
              <Button
                onClick={onClickLoading}
                type='primary'
                htmlType='submit'
                shape='round'
                loading={loader}
              >
                Add designation
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className='mt-5 border p-3 rounded' bordered>
          <Title level={4} className='m-2 text-center'>
            Import From CSV
          </Title>
          <UploadMany urlPath={"designation"} />
        </div>
      </CreateDrawer>
    </>
  );
};

export default AddDesignation;
