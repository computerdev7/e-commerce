import express from 'express'
import productInfo from '../model/productInfoModel.js'
import checkCookie from '../middleware/checkCookies.js'
import CheckUserType from '../middleware/checkUserType.js'
import ProductSchema from '../model/productModel.js'
import authSchema from "../model/authModel.js"
import { getCategories,getAllProducts } from '../controller/userProductController.js'
import { addtocart,cartlist,removeFromCart } from '../controller/userCartController.js'
import { searchSuggestion, userSearch } from '../controller/userSearchController.js'

let route = express.Router()


route.get('/getCategories',checkCookie,CheckUserType('user'),getCategories)

route.get('/getAllProducts',checkCookie,CheckUserType('user'),getAllProducts)



route.post('/addtocart',checkCookie,CheckUserType('user'),addtocart)

route.get('/cartlist',checkCookie,CheckUserType('user'),cartlist)

route.delete('/removefromcart',checkCookie,CheckUserType('user'),removeFromCart)



route.get('/search',checkCookie,CheckUserType('user'),userSearch)

route.get('/searchsuggestion',checkCookie,CheckUserType('user'),searchSuggestion)


export default route