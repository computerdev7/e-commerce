import { Routes,Route } from "react-router"
import Home from "./pages/userHome.jsx"
import Signup from "./pages/userauth/usersignup.jsx"
import Login from "./pages/userauth/userlogin.jsx"
import VendorSignup from "./pages/vendorauth/vendorSignup.jsx"
import VendorLogin from "./pages/vendorauth/vendorLogin.jsx"
import VendorHome from "./pages/vendorHome.jsx"
import AddProduct from "./pages/vendorpages/addProductPage.jsx"
import UpdateProduct from "./pages/vendorpages/updateProductPage.jsx"

export default function App() {

  return (
      <>
      <Routes>
          <Route path="/userhome" element={<Home/>} />
          <Route path="/vendorhome" element={<VendorHome/>} />
          <Route path="/usersignup" element={<Signup/>} />
          <Route path="/userlogin" element={<Login/>} />
          <Route path="/vendorsignup" element={<VendorSignup/>} />
          <Route path="/vendorlogin" element={<VendorLogin/>} />
          <Route path="/addproduct" element={<AddProduct/>} />
          <Route path="/updateproduct/:id" element={<UpdateProduct/>} />
      </Routes>
      </>
  )
}
