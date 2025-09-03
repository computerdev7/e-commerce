import express from "express"
import ProductSchema from "../model/productModel.js";
import checkCookie from "../middleware/checkCookies.js";
import CheckUserType from "../middleware/checkUserType.js";
import { getPreSignedImageUrl, getDeletePreSignedUrl } from "../utils/presigned_url/getPresignedImageUrl.js";
import { getAllProducts, getProduct } from "../controller/vendorGetProducts.js";
import { searchSuggestion } from "../controller/vendorSearchProducts.js";
import { addProduct, deleteProduct, updateProduct } from "../controller/vendorCrudProducts.js";
let route = express.Router()


route.post('/addproduct', checkCookie, CheckUserType('vendor'), addProduct)

route.delete('/deleteProduct/:id', checkCookie, CheckUserType('vendor'), deleteProduct)

route.patch('/updateProduct', checkCookie, CheckUserType('vendor'), updateProduct)



route.get('/getAllProducts', checkCookie, CheckUserType('vendor'),getAllProducts)

route.get('/getProduct/:id', checkCookie, CheckUserType('vendor'), getProduct)



route.get('/searchsuggestion',checkCookie,CheckUserType('vendor'),searchSuggestion)


export default route