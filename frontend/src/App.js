import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import DetailsSup from "./components/suppliers/detailsSup";
import Suppliers from "./components/suppliers/suppliers";
import UpdateSup from "./components/suppliers/updateSup";

import UserPrivateRoute from "./components/PrivacyComponent/UserPrivateRoute";
import DetailsProd from "./components/product/detailsProd";
import Product from "./components/product/product";
import UpdateProd from "./components/product/updateProd";

import DetailsPurch from "./components/purchase/detailsPurch";

import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import UserList from "./components/user/user";

import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Customer from "./components/customer/customer";
import DetailCust from "./components/customer/detailCust";
import UpdateCust from "./components/customer/updateCust";

import DetailSale from "./components/sale/detailSale";

import Page404 from "./components/404/404Page";
import Dashboard from "./components/Dashboard/Graph/Dashboard";
import AddCustPaymentByInvoice from "./components/Payment/CustomerPaymentByInvoice";
import AddSupPaymentByInvoice from "./components/Payment/SupplierPaymentByInvoice";
import UpdateProductBrand from "./components/productBrand/updateProductBrand";
import UpdateProductSubcategory from "./components/ProductSubcategory/updateProductSubcategory";
import GetAllPurch from "./components/purchase/getAllPurch";
import GetAllSale from "./components/sale/getAllSale";
import DetailStaff from "./components/user/detailsStaff";
import UpdateStaff from "./components/user/updateStaff";

// import Register from "./components/user/Register";
import { Layout } from "antd";
import { useDispatch } from "react-redux";
import Account from "./components/account/account";
import BalanceSheet from "./components/account/balanceSheet";
import DetailAccount from "./components/account/detailAccount";
import IncomeStatement from "./components/account/incomeStatement";
import TrialBalance from "./components/account/trialBalance";
import Designation from "./components/designation/designation";
import DetailDesignation from "./components/designation/detailDesignation";
import UpdateDesignation from "./components/designation/updateDesignation";
import Main from "./components/layouts/Main";
import Pos from "./components/pos/pos";
import AddProd from "./components/product/addProd";
import ImportFromCSV from "./components/product/UploadMany";
import DetailProductBrand from "./components/productBrand/detailProductBrand";
import ProductBrand from "./components/productBrand/productBrand";
import DetailProductCategory from "./components/productCategory/detailProductCategory";
import ProductCategory from "./components/productCategory/productCategory";
import UpdateProductCategory from "./components/productCategory/updateProductCategory";
import DetailProductSubCategory from "./components/ProductSubcategory/detailProductSubcategory";
import ProductSubcategory from "./components/ProductSubcategory/productSubcategory";
import AddReturnPurchase from "./components/purchase/addReturnPurchase";
import AddPermission from "./components/role/AddPermission";
import DetailRole from "./components/role/DetailsRole";
import RoleList from "./components/role/role";
import AddReturnSale from "./components/sale/addReturnSale";
import InvoiceSetting from "./components/settings/invoiceSetting";
// import TestComp from "./components/Test/TestComp";

import DetailProductColor from "./components/productColor/detailProductColor";
import ProductColor from "./components/productColor/productColor";
import UpdateProductColor from "./components/productColor/updateProductColor";
import AddTransaction from "./components/transaction/AddTransaction";
import DetailTransaction from "./components/transaction/detailTransaction";
import Transaction from "./components/transaction/transaction";
import CustomerLogin from "./components/user/CustomerLogin";
import CustomerLogout from "./components/user/CustomerLogout";
import CustomerRegestration from "./components/user/CustomerRegister";
import VatTax from "./components/vatTax/VatTax";
import { loadCartFromStorage } from "./redux/rtk/features/cart/cartSlice";

const { Sider } = Layout;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const cartInStorage = JSON.parse(localStorage.getItem("cart"));

    if (!cartInStorage?.length) {
      localStorage.setItem("cart", JSON.stringify([]));
    } else {
      dispatch(loadCartFromStorage(cartInStorage));
    }
  }, [dispatch]);
  return (
    <div className='App container-fluid'>
      <BrowserRouter>
        {/* <TestComp/> */}
        <Main>
          <ToastContainer
            closeButton
            position='bottom-left'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme='colored'
          />
          <Routes>
            <Route path='/' element={<Dashboard />} />

            <Route path='/admin/dashboard' element={<Dashboard />}></Route>
            <Route path='/admin' element={<Dashboard />} />
            <Route path='*' element={<Page404 />} />

            {/* ====================================================
                          Supplier Permetion add here 
            ========================================================*/}
            <Route
              element={<UserPrivateRoute permission={"readAll-supplier"} />}
            >
              <Route path='/admin/supplier' exact element={<Suppliers />} />
            </Route>
            <Route
              element={<UserPrivateRoute permission={"readSingle-supplier"} />}
            >
              <Route path='/admin/supplier/:id' element={<DetailsSup />} />
            </Route>
            <Route
              element={<UserPrivateRoute permission={"update-supplier"} />}
            >
              <Route
                path='/admin/supplier/:id/update'
                element={<UpdateSup />}
              />
            </Route>

            {/* ====================================================
                          Product Permetion add here
            ========================================================*/}
            <Route
              element={<UserPrivateRoute permission={"readAll-product"} />}
            >
              <Route path='/admin/product' exact element={<Product />} />
            </Route>

            <Route element={<UserPrivateRoute permission={"create-product"} />}>
              <Route path='/admin/add-product' exact element={<AddProd />} />
            </Route>

            <Route
              element={<UserPrivateRoute permission={"readSingle-product"} />}
            >
              <Route path='/admin/product/:id' element={<DetailsProd />} />
            </Route>

            <Route element={<UserPrivateRoute permission={"create-product"} />}>
              <Route
                path='/admin/product/importcsv'
                exact
                element={<ImportFromCSV urlPath={"product"} title='Product' />}
              />
            </Route>

            <Route element={<UserPrivateRoute permission={"update-product"} />}>
              <Route
                path='/admin/product/:id/update'
                element={<UpdateProd />}
              />
            </Route>

            {/*================================================
                       Product Category Permetion add here
               ================================================*/}

            <Route
              path='/admin/product-category'
              exact
              element={<ProductCategory />}
            />

            <Route
              element={<UserPrivateRoute permission={"readSingle-product"} />}
            >
              <Route
                path='/admin/product-category/:id'
                element={<DetailProductCategory />}
              />
            </Route>

            <Route element={<UserPrivateRoute permission={"update-product"} />}>
              <Route
                path='/admin/product-category/:id/update'
                element={<UpdateProductCategory />}
              />
            </Route>

            <Route
              element={
                <UserPrivateRoute permission={"readAll-productSubCategory"} />
              }
            >
              <Route
                path='/admin/product-subcategory'
                exact
                element={<ProductSubcategory />}
              />
            </Route>

            <Route
              element={
                <UserPrivateRoute
                  permission={"readSingle-productSubCategory"}
                />
              }
            >
              <Route
                path='/admin/product-subcategory/:id'
                element={<DetailProductSubCategory />}
              />
            </Route>

            <Route
              element={
                <UserPrivateRoute permission={"update-productSubCategory"} />
              }
            >
              <Route
                path='/admin/product-subcategory/:id/update'
                element={<UpdateProductSubcategory />}
              />
            </Route>

            <Route
              element={<UserPrivateRoute permission={"readAll-productBrand"} />}
            >
              <Route
                path='/admin/product-brand'
                exact
                element={<ProductBrand />}
              />
            </Route>

            <Route
              element={
                <UserPrivateRoute permission={"readSingle-productBrand"} />
              }
            >
              <Route
                path='/admin/product-brand/:id'
                element={<DetailProductBrand />}
              />
            </Route>

            <Route
              element={<UserPrivateRoute permission={"update-productBrand"} />}
            >
              <Route
                path='/admin/product-brand/:id/update'
                element={<UpdateProductBrand />}
              />
            </Route>

            <Route element={<UserPrivateRoute permission={"create-vat"} />}>
              <Route path='/admin/vat-tax' exact element={<VatTax />} />
            </Route>

            <Route path='/admin/product-color' element={<ProductColor />} />

            <Route
              path='/admin/product-color/:id'
              element={<DetailProductColor />}
            />
            <Route
              path='/admin/product-color/:id/update'
              element={<UpdateProductColor />}
            />

            <Route path='/admin/purchase' exact element={<GetAllPurch />} />

            <Route path='/admin/purchase/:id' element={<DetailsPurch />} />
            <Route
              path='/admin/purchase/return/:id'
              element={<AddReturnPurchase />}
            />

            <Route path='/admin/customer' exact element={<Customer />} />
            <Route path='/admin/customer/:id' element={<DetailCust />} />
            <Route path='/admin/customer/:id/update' element={<UpdateCust />} />
            <Route path='/admin/sale' exact element={<GetAllSale />} />

            <Route path='/admin/sale/:id' element={<DetailSale />} />
            <Route path='/admin/sale/:id/update' element={<UpdateProd />} />
            <Route path='/admin/sale/return/:id' element={<AddReturnSale />} />
            <Route
              path='/admin/payment/supplier/:pid'
              exact
              element={<AddSupPaymentByInvoice />}
            />
            <Route
              path='/admin/payment/customer/:pid'
              exact
              element={<AddCustPaymentByInvoice />}
            />
            <Route path='/admin/transaction' exact element={<Transaction />} />
            <Route
              path='/admin/transaction/create'
              exact
              element={<AddTransaction />}
            />
            <Route
              path='/admin/transaction/:id'
              element={<DetailTransaction />}
            />

            <Route path='/admin/auth/login' exact element={<Login />} />
            <Route path='/admin/auth/logout' exact element={<Logout />} />
            {/*         <Route path='/auth/register' exact element={<Register />} /> */}
            <Route path='/admin/hr/staffs' exact element={<UserList />} />
            <Route
              path='/admin/hr/staffs/:id'
              exact
              element={<DetailStaff />}
            />
            <Route
              path='/admin/hr/staffs/:id/update'
              element={<UpdateStaff />}
            />

            <Route path='/admin/role' exact element={<RoleList />} />
            <Route path='/admin/role/:id' element={<DetailRole />} />
            <Route path='/admin/role/permit/:id/' element={<AddPermission />} />

            <Route path='/admin/account' exact element={<Account />} />
            <Route path='/admin/account/:id' element={<DetailAccount />} />
            <Route
              path='/admin/account/trial-balance'
              exact
              element={<TrialBalance />}
            />
            <Route
              path='/admin/account/balance-sheet'
              exact
              element={<BalanceSheet />}
            />
            <Route
              path='/admin/account/income'
              exact
              element={<IncomeStatement />}
            />
            <Route path='/admin/designation' exact element={<Designation />} />
            <Route
              path='/admin/designation/:id'
              element={<DetailDesignation />}
            />
            <Route
              path='/admin/designation/:id/update'
              element={<UpdateDesignation />}
            />

            <Route path='/admin/pos' exact element={<Pos />} />

            <Route
              path='/admin/invoice-setting'
              exact
              element={<InvoiceSetting />}
            />

            <Route
              path='/customer/register'
              element={<CustomerRegestration />}
            />
            <Route path='/customer/login' element={<CustomerLogin />} />
            <Route path='/customer/logout' element={<CustomerLogout />} />
          </Routes>
        </Main>
      </BrowserRouter>
    </div>
  );
}

export default App;
