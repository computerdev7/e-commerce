import express from "express"
import CheckUserType from "../middleware/checkUserType.js"
import checkCookie from "../middleware/checkCookies.js"
import { createOrder, checkOrder, } from "../controller/userOrderGetCheck.js"
import { getOrders, notAvailable, cancelOrder, delivered, returned, refunddelivery } from "../controller/checkOutController.js"

let route = express.Router();

route.post('/create-order', checkCookie, CheckUserType('user'), createOrder)

route.post('/check-order', checkCookie, CheckUserType('user'), checkOrder)

route.get('/getorders', checkCookie, CheckUserType('user'), getOrders)

route.delete('/notavailable', checkCookie, CheckUserType('user'), notAvailable)

route.put('/cancelorder', checkCookie, CheckUserType('user'), cancelOrder)

route.put('/delivered', checkCookie, CheckUserType('user'),delivered)

route.post('/return', checkCookie, CheckUserType('user'), returned)

route.put('/refunddelivery', checkCookie, CheckUserType('user'), refunddelivery)

export default route