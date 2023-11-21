import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../features/account/accountSlice";
import cartReducer from "../features/cart/cartSlice";
import colorReducer from "../features/color/colorSlice";
import customerReducer from "../features/customer/customerSlice";
import customerPaymentReducer from "../features/customerPayment/customerPaymentSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import designationReducer from "../features/designation/designationSlice";
import roleSlice from "../features/hr/role/roleSlice";
import productReducer from "../features/product/productSlice";
import productBrandReducer from "../features/productBrand/productBrandSlice";
import productCategoryReducer from "../features/productCategory/productCategorySlice";
import productSubCategoryReducer from "../features/productSubCategory/productSubCategorySlice";
import purchaseReducer from "../features/purchase/purchaseSlice";
import saleReducer from "../features/sale/saleSlice";
import sliderSlice from "../features/slider/sliderSlice";
import supplierReducer from "../features/supplier/supplierSlice";
import supplierPaymentReducer from "../features/supplierPayment/supplierPaymentSlice";
import transactionReducer from "../features/transaction/transactionSlice";
import userReducer from "../features/user/userSlice";
import vatTaxSlice from "../features/vatTax/vatTaxSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    suppliers: supplierReducer,
    products: productReducer,
    purchases: purchaseReducer,
    customers: customerReducer,
    sales: saleReducer,
    users: userReducer,
    supplierPayments: supplierPaymentReducer,
    accounts: accountReducer,
    dashboard: dashboardReducer,
    transactions: transactionReducer,
    productCategories: productCategoryReducer,
    productSubCategories: productSubCategoryReducer,
    productBrands: productBrandReducer,
    designations: designationReducer,
    colors: colorReducer,
    customerPayments: customerPaymentReducer,
    sliders: sliderSlice,
    vatTax: vatTaxSlice,
    role: roleSlice,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
