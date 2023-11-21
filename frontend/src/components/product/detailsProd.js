import { EditOutlined, SolutionOutlined } from "@ant-design/icons";
import { Card, Col, Image, Row, Typography } from "antd";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  clearProduct,
  deleteProduct,
  loadSingleProduct,
} from "../../redux/rtk/features/product/productSlice";
import CommonDelete from "../CommonUi/CommonDelete";
import Loader from "../loader/loader";

const DetailsProd = () => {
  const { id } = useParams();

  //dispatch
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.product);

  useEffect(() => {
    dispatch(loadSingleProduct(id));
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);
  const handleOnError = (e) => {
    e.target.src = "/images/default.jpg";
  };
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }
  return (
    <div>
      <div className='mr-top'>
        {product ? (
          <Fragment key={product?.id}>
            <Card bordered={false} className='card-custom'>
              <div className='card-header flex justify-between m-3'>
                <div className='flex'>
                  <SolutionOutlined className='text-xl' />
                  <span className='mr-left mt-1 font-bold text-lg'>
                    ID : {product?.id} | {product?.name}
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <Link
                    className='m-2 inline-block bg-blue-500 p-2 text-white rounded-md'
                    to={`/admin/product/${product?.id}/update`}
                    state={{ data: product }}
                  >
                    <EditOutlined className='p-0 w-7 h-7 text-xl' />
                  </Link>
                  <CommonDelete
                    id={id}
                    className={"p-1 w-11 h-11 text-xl"}
                    permission={"delete-product"}
                    deleteThunk={deleteProduct}
                    navigatePath={"/admin/product"}
                  />
                </div>
              </div>
              <Row className='flex justify-evenly  align-middle'>
                <Col xs={24} xl={8} className='flex'>
                  <div className='card-body align-middle grid'>
                    <h5 className='text-xl font-bold'> Product Information</h5>

                    <p>
                      <Typography.Text strong className='font-medium text-lg'>
                        Purchase Price :
                      </Typography.Text>{" "}
                      <span className='text-lg'>
                        {product?.productPurchasePrice}
                      </span>
                    </p>

                    <p>
                      <Typography.Text strong className='font-medium text-lg'>
                        Sale Price :
                      </Typography.Text>{" "}
                      <span className='text-lg'>
                        {product?.productSalePrice}
                      </span>
                    </p>
                    <p>
                      <Typography.Text strong className='font-medium text-lg'>
                        Product Vat :
                      </Typography.Text>{" "}
                      <span className='text-lg'>{product?.productVat}% </span>
                    </p>
                    <p>
                      <Typography.Text strong className='font-medium text-lg'>
                        Discount :
                      </Typography.Text>{" "}
                      <span className='text-lg'>
                        {product?.discount ? product?.discount : 0}
                      </span>
                    </p>
                    <p>
                      <Typography.Text strong className='font-medium text-lg'>
                        Quantity :
                      </Typography.Text>{" "}
                      <span className='text-lg'>
                        {product?.productQuantity}
                      </span>
                    </p>
                    <p>
                      <Typography.Text strong className='font-medium text-lg'>
                        Sku :
                      </Typography.Text>{" "}
                      <span className='text-lg'>{product?.sku}</span>
                    </p>
                    <p>
                      <Typography.Text strong className='font-medium text-lg'>
                        Unit Type :
                      </Typography.Text>{" "}
                      <span className='text-lg'>{product?.unitType}</span>
                    </p>
                    <p>
                      <Typography.Text strong className='font-medium text-lg'>
                        Unit Measurement :
                      </Typography.Text>{" "}
                      <span className='text-lg'>
                        {product?.unitMeasurement}
                      </span>
                    </p>
                    <p className='flex items-center gap-2'>
                      <Typography.Text strong className='font-medium text-lg'>
                        Product Colors :
                      </Typography.Text>{" "}
                      <span className='text-lg flex items-center gap-3'>
                        {product?.productColor?.map((item) => (
                          <>
                            <div className='flex gap-1 items-center'>
                              <span>{item.color.name}</span>
                              <span
                                style={{
                                  backgroundColor: item.color?.colorCode,
                                }}
                                className='w-5 h-3 inline-block'
                              ></span>
                            </div>
                          </>
                        ))}
                      </span>
                    </p>
                  </div>
                </Col>
                <Col xs={24} xl={8}>
                  <div className='card-body w-full ms-3'>
                    <Image
                      className='fluid'
                      src={product?.thumbnailImageUrl}
                      onError={handleOnError}
                    />
                  </div>
                </Col>
              </Row>
              <div>
                <h1 className='font-medium text-xl text-center py-5 mt-10'>
                  Product description
                </h1>
                <p
                  className='text-lg'
                  dangerouslySetInnerHTML={{ __html: product?.description }}
                ></p>
              </div>
            </Card>
          </Fragment>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default DetailsProd;
