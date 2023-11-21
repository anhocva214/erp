import { DeleteOutlined, EditOutlined, SolutionOutlined } from "@ant-design/icons";
import { Button, Card, Popover } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearDesignation,
  deleteDesignation,
  loadSingleDesignation,
} from "../../redux/rtk/features/designation/designationSlice";
import Loader from "../loader/loader";
import UserListCard from "./List/UserListCard";
//PopUp

const DetailDesignation = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  //dispatch
  const dispatch = useDispatch();
  const designation = useSelector((state) => state.designations.designation);

  //Delete Supplier
  const onDelete = () => {
    try {
      dispatch(deleteDesignation(id));

      setVisible(false);
      toast.warning(`Designation : ${designation.name} is removed `);
      return navigate("/admin/designation");
    } catch (error) {
      console.log(error.message);
    }
  };

  // Delete Supplier PopUp
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  useEffect(() => {
    dispatch(loadSingleDesignation(id));
    return () => {
      dispatch(clearDesignation());
    };
  }, [dispatch, id]);

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  return (
    <div>
      <div className='mr-top'>
        {designation ? (
          <Fragment key={designation.id}>
            <Card bordered={false} style={{}}>
              <div className='flex justify-between' style={{ padding: 0 }}>
                <div className='w-50'>
                  <h5 className='text-xl'>
                    <SolutionOutlined />
                    <span className='mr-left'>
                      ID : {designation.id} | {designation.name}
                    </span>
                  </h5>
                </div>
                <div className='text-end w-50'>
                  <Link
                    className='mr-3 inline-block'
                    to={`/admin/designation/${designation.id}/update`}
                    state={{ data: designation }}
                  >
                    <Button
                      type='primary'
                      shape='round'
                      icon={<EditOutlined />}
                    ></Button>
                  </Link>
                  <Popover
                    content={
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      <a onClick={onDelete}>
                        <Button type='primary' danger>
                          Yes Please !
                        </Button>
                      </a>
                    }
                    title='Are you sure you want to delete ?'
                    trigger='click'
                    visible={visible}
                    onVisibleChange={handleVisibleChange}
                  >
                    <Button
                      type='danger'
                      DetailDesignation
                      shape='round'
                      icon={<DeleteOutlined />}
                    ></Button>
                  </Popover>
                </div>
              </div>

              <UserListCard list={designation?.user} />
            </Card>
          </Fragment>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default DetailDesignation;
