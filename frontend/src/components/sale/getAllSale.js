import { Link, Navigate } from "react-router-dom";
import "./sale.css";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Select } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllSale } from "../../redux/rtk/features/sale/saleSlice";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import ViewBtn from "../Buttons/ViewBtn";
import DashboardCard from "../Card/DashboardCard";
import CreateDrawer from "../CommonUi/CreateDrawer";
import StatusSelection from "../CommonUi/StatusSelection";
import TableComponent from "../CommonUi/TableComponent";
import SaleReportPrint from "../Invoice/SaleReport";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import { BtnBtn2 } from "../UI/BtnBtn2";
import AddSale from "./addSale";

const GetAllSale = (props) => {
  const dispatch = useDispatch();
  const {
    list,
    total,
    loading: saleLoading,
  } = useSelector((state) => state.sales);
  const userList = useSelector((state) => state.users.list);
  const [user, setUser] = useState("");
  const [startdate, setStartDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [enddate, setEndDate] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      id: 1,
      title: "Invoice No",
      dataIndex: "id",
      key: "id",
      render: (name, { id }) => <Link to={`/admin/sale/${id}`}>{id}</Link>,
    },
    {
      id: 2,
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("ll"),
    },
    {
      id: 3,
      title: "Customer Name ",
      dataIndex: `customer`,
      key: "customerId",
      render: (customer) => customer?.name,
    },

    {
      id: 4,
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      id: 5,
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      id: 6,
      title: "Due Amount",
      dataIndex: "dueAmount",
      key: "dueAmount",
      responsive: ["md"],
    },
    {
      id: 7,
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      responsive: ["md"],
    },

    //Update Supplier Name here

    {
      id: 8,
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      render: (profit) => Number(profit).toFixed(2),
      responsive: ["md"],
    },
    {
      id: 9,
      title: "Sale Person",
      dataIndex: "user",
      key: "user",
      render: (user) => user?.username,
      responsive: ["md"],
    },
    {
      id: 10,
      title: "Action",
      dataIndex: "id",
      key: "payment",
      render: (id, { dueAmount }) => (
        <div className='flex '>
          <ViewBtn path={`/admin/sale/${id}`} />
          <Link
            to={dueAmount ? `/admin/payment/customer/${id}` : "#"}
            state={{ dueAmount: dueAmount || 0 }}
          >
            <BtnBtn2 className='btn btn-dark btn-sm ' disabled={!dueAmount}>
              Payment
            </BtnBtn2>
          </Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(loadAllStaff({ status: true }));
  }, [dispatch]);

  const { RangePicker } = DatePicker;

  useEffect(() => {
    dispatch(
      loadAllSale({
        page: 1,
        count: 10,
        startdate: startdate,
        enddate: enddate,
        user: "",
      })
    );
  }, [dispatch, enddate, startdate]);

  const onSearchFinish = async (values) => {
    setUser(values?.user);
    const resp = await dispatch(
      loadAllSale({
        page: 1,
        count: "",
        startdate: startdate,
        enddate: enddate,
        user: values.user ? values.user : "",
      })
    );
    if (resp.payload.message === "success") {
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const [form] = Form.useForm();

  const onCalendarChange = (dates) => {
    const startdate = (dates?.[0]).format("YYYY-MM-DD");
    const enddate = (dates?.[1]).format("YYYY-MM-DD");
    setStartDate(startdate);
    setEndDate(enddate);
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <>
      <div className='card card-custom mt-2'>
        <div className='card-body'>
          <div className='card-title flex  md:flex-row center justify-content-md-center mt-1 py-2'>
            <div>
              <Form
                onFinish={onSearchFinish}
                form={form}
                layout={"inline"}
                onFinishFailed={() => setLoading(false)}
              >
                <Form.Item name='user'>
                  <Select
                    className='salelist-saleperson-input'
                    loading={!userList}
                    placeholder='Sale Person'
                    style={{ width: 200 }}
                    allowClear
                  >
                    <Select.Option value=''>All</Select.Option>
                    {userList &&
                      userList.map((i) => (
                        <Select.Option value={i.id}>{i.username}</Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <div className=' mr-2'>
                  <RangePicker
                    onCalendarChange={onCalendarChange}
                    defaultValue={[
                      dayjs(startdate, "YYYY-MM-DD"),
                      dayjs(enddate, "YYYY-MM-DD"),
                    ]}
                    className='range-picker'
                  />
                </div>

                <Form.Item>
                  <Button
                    onClick={() => setLoading(true)}
                    loading={loading}
                    type='primary'
                    htmlType='submit'
                    className='salelist-search-btn btnHeight'
                  >
                    <SearchOutlined />
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
          <DashboardCard
            information={total?._sum
              ? Number(total?._sum).toFixed(3)
              : 0}
            count={total?._count}
            isCustomer={true}
          />
          <br />

          <Card className='border-0 md:border md:p-6 bg-transparent md:bg-[#fafafa]' bodyStyle={{ padding: 0 }}>
            <div className='md:flex items-center justify-between pb-3'>
              <h1 className='text-lg font-bold'>Sale list</h1>
              <div className='flex justify-between md:justify-start gap-1 md:gap-3 items-center'>
                <StatusSelection
                  paginatedThunk={loadAllSale}
                  query={{ user, startdate, enddate }}
                />
                <div className='xxs:w-1/2 md:w-full xxs:flex-col md:flex-row  flex xxs:gap-1'>
                  <SaleReportPrint
                    data={list}
                    date={{ startdate, enddate }}
                    user={user}
                    total={total?._sum}
                  />
                  <CreateDrawer
                    permission={"create-saleInvoice"}
                    title={"Add Sale"}
                    width={70}
                  >
                    <AddSale />
                  </CreateDrawer>
                </div>
              </div>
            </div>
            <UserPrivateComponent permission={"readAll-saleInvoice"}>
              <TableComponent
                list={list}
                columns={columns}
                loading={saleLoading}
                total={total?._count?.id}
                paginatedThunk={loadAllSale}
                csvFileName={"all sale"}
                query={{ startdate, enddate }}
              />
            </UserPrivateComponent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default GetAllSale;
