import express from "express"
import orderSchema from "../model/orderModel.js"
import checkCookie from "../middleware/checkCookies.js"
import CheckUserType from "../middleware/checkUserType.js"
import { getOrders, setAvailable, packaged, cancelOrder, delivery, getDelivery, refundDelivery } from "../controller/vendorCheckOut.js"

let route = express.Router();

route.get('/getorders',checkCookie, CheckUserType('vendor'),getOrders)

route.put('/setavailable', checkCookie, CheckUserType('vendor'),setAvailable)

route.put('/packaged',checkCookie, CheckUserType('vendor'),packaged)

route.delete('/confirmordercancel',checkCookie, CheckUserType('vendor'),cancelOrder)

route.put('/delivery',checkCookie, CheckUserType('vendor'),delivery)

route.put('/getdelivery',checkCookie, CheckUserType('vendor'),getDelivery)

route.put('/refunddelivered',checkCookie, CheckUserType('vendor'),refundDelivery)

export default route;