import express from "express"
import { signup,login } from "../controller/authUserController.js"
import { vendorSignup,vendorLogin } from "../controller/authVendorcontroller.js"

let route = express.Router()

route.post('/user/signup', signup)

route.post('/user/login', login)

route.post('/vendor/signup', vendorSignup)

route.post('/vendor/login', vendorLogin)

export default route;