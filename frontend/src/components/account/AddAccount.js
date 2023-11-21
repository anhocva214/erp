import { Button, Card, Form, Input, Select, Typography } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./AddNewAccount.module.css";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addAccount,
  loadAllAccount,
} from "../../redux/rtk/features/account/accountSlice";
import { getMainAccount } from "./account.api";

const AddAccount = ({ drawer }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { Title } = Typography;

  const [form] = Form.useForm();
  const [loader, setLoader] = useState(false);

  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
    const getAccounts = async () => {
      const response = await getMainAccount();
      setAccounts(response);
    };
    getAccounts();
  }, []);

  const onFinish = async (values) => {
    try {
      const resp = await dispatch(addAccount(values));
      if (resp.payload.message === "success") {
        setLoader(false);
        dispatch(loadAllAccount());
      }

      toast.success("Account Added");
      form.resetFields();
      setLoader(false);
    } catch (error) {
      toast.error("Error in adding account");
      console.log(error.message);
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setLoader(false);
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <div>
      <Card bordered={false}>
        <Title level={4} className='m-2 text-center'>
          Add Account
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
            name='name'
            label='Name'
            rules={[
              {
                required: true,
                message: "Please input debit account!",
              },
            ]}
          >
            <Input placeholder='Name' />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            name='accountId'
            label='Account Type'
            rules={[
              {
                required: true,
                message: "Please input debit account!",
              },
            ]}
          >
            <Select
              loading={!accounts}
              showSearch
              style={{
                width: "100%",
              }}
              placeholder='Select Account Type'
              optionFilterProp='children'
              filterOption={(input, option) => option.children.includes(input)}
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {accounts &&
                accounts.map((acc) => (
                  <Select.Option key={acc.id} value={acc.id}>
                    {acc.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "10px" }}
            className={styles.addNewAccountBtnContainer}
          >
            <Button
              type='primary'
              htmlType='submit'
              shape='round'
              loading={loader}
              onClick={() => setLoader(true)}
            >
              Add New Account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddAccount;
