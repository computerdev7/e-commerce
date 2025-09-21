import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import userOrder from "../../stores/userOrder";
import ProductPage from "../userpages/productPage.jsx"
import store_util from "../../stores/store_util.jsx";

export default function UserOrder() {

    let [orders, setOrders] = useState([]);
    let [refundFeedback, setRefundFeedback] = useState({})
    let [selectFilter, setSelectFilter] = useState('all');
    let { orderIsNotAvailable, cancelOrder, delivered, returnOrder, giveOrderToDelivery, applyFilter } = userOrder();
    let { product_id, setProduct_id } = store_util()

    useEffect(() => {

        axios.get(`http://localhost:3000/userorder/getorders?o=${selectFilter}`, {
            withCredentials: true
        })
            .then(res => setOrders(res.data.message))

    }, [])

    function calcDeliveryDate(date) {
        let expiryDate = new Date(date);
        let setExpiry = expiryDate.getTime() + 2 * 60 * 1000
        let newdate = new Date()

        let diff = setExpiry - newdate

        let diffM = diff / (1000 * 60)
        let diffS = diff / (1000)

        let time = `${diffM}|${diffS}`

        return parseInt(time)

    }

    let renderOrders = useMemo(() => {
       return orders?.map((e, i) => {
    
            let time = calcDeliveryDate(e.updatedAt);
    
            return (
                <>
                    <div className="min-h-60 w-full border border-b">
                        <div
                        onClick={()=> {
                            setProduct_id({id : e.product_id._id, cond : true})
                        }}
                        className="h-40 border-b p-1 flex w-full">
                            <div className="h-full w-1/4">
                                <img className="h-full max-w-full" src={e.product_id?.imageUrl?.image300} />
                            </div>
                            <div className="h-full w-3/4">
                                <div className="h-2/3 w-full">
                                    <p>{e.product_id?.product_name}</p>
                                </div>
                                <div className="h-1/3 w-full flex items-center justify-around">
                                    <div>
                                        <p>quantity</p>
                                    </div>
                                    <div>
                                        <p>price</p>
                                        <p>{e.product_id?.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="min-h-20 w-full p-2 relative">
                            {e.available ?
                                <>
                                    {e.isCancelOrder == undefined ?
                                        <>
                                            <p className="absolute top-0 right-0 text-xs">{e?.user_state == 'new order' ? 'Recent Orders' : e.user_state == 'success' ? 'Order Recieved' : e.user_state == 'refunded' ? 'Returned Orders' : undefined}</p>
                                            {(e.state == 'packaging' || e.state == 'packaged' && e.user_state == 'new order') &&
                                                <div className="w-full h-full flex justify-end items-center">
                                                    <button
                                                        onClick={() => {
                                                            cancelOrder(e._id)
                                                        }}
                                                        className="p-2 border text-lg">
                                                        cancel order
                                                    </button>
                                                </div>
                                            }
                                            {(e.state == 'on delivery' && e.user_state == 'new order') &&
                                                <>
                                                    {time <= 0
                                                        ?
                                                        <>
                                                            <p>did you get your order ?</p>
                                                            <button
                                                                onClick={() => {
                                                                    delivered(e._id)
                                                                }}
                                                                className="border p-1 text-sm">
                                                                yes
                                                            </button>
                                                        </>
                                                        :
                                                        <p>Delivery time left in minutes and seconds
                                                            {time}
                                                        </p>
                                                    }
                                                </>
                                            }
                                            {(e.state == 'delivered' && e.user_state == 'success') &&
                                                <>
                                                    <div className="min-h-20 w-full">
                                                        <p className="text-center text-lg">thankou for the order</p>
                                                        <p>want to return the product???</p>
                                                        <div className="w-full items-end flex justify-between">
                                                            <textarea value={refundFeedback[i]} placeholder="what is wrong in the product..."
                                                                onChange={(e) => setRefundFeedback(prev => ({ ...prev, [i]: e.target.value }))} className="w-4/5 h-20 resize-none border p-1"></textarea>
                                                            <div className="w-1/5 text-center">
                                                                <button
                                                                    onClick={() => {
                                                                        returnOrder(e._id, refundFeedback[i])
                                                                    }}
                                                                    className="p-2 border h-fit">
                                                                    return
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </>
                                        :
                                        <p>Order is canceled</p>
                                    }
                                </>
                                :
                                <div className="h-20 w-full flex justify-start items-center p-2 text-lg">
                                    <p>Processing the order</p>
                                </div>
                            }
                            {e.available == false && e.user_state == 'new order' ?
                                <>
                                    <p>Order is not available</p>
                                    <button
                                        onClick={() => {
                                            orderIsNotAvailable(e._id)
                                        }}
                                        className="border p-2">
                                        OKK
                                    </button>
                                </>
                                :
                                undefined
                            }
                            {e.state == 'packaged' && e.user_state == 'refunded' &&
                                <>
                                    <p>did you give your order to delivery guy?</p>
                                    <button className="border text-sm p-1"
                                        onClick={() => {
                                            giveOrderToDelivery(e._id)
                                        }}
                                    >
                                        yes
                                    </button>
                                </>
                            }
                            {(e.state == 'on delivery' && e.user_state == 'refunded' || e.state == 'delivered' && e.user_state == 'refunded' && e.isRefunded == false)
                                &&
                                <p>wait paitently your refund will arrive shortly</p>
                            }
                            {e.isRefunded &&
                                <p>your refund has been arrived and once again thank you for using our service</p>
                            }
                        </div>
    
                    </div>
                </>
            )
        })
    },[orders])
    
console.log(product_id)
    return (
        <>  {product_id.cond ?
            <ProductPage id={product_id.id} />
            :
            <div className="w-screen min-h-screen scroll-y-overflow p-5 flex flex-col gap-5">
                <div className="h-10 border flex justify-between items-center pl-5 pr-5">
                    <p>Orders</p>
                    <div className="flex justify-around items-center w-1/3">
                        <select className="border" value={selectFilter} onChange={(e) => setSelectFilter(e.target.value)}>
                            <option value={'all'}>All</option>
                            <option value="new order">Recent Orders</option>
                            <option value="success">Orders Recieved</option>
                            <option value="refunded">Orders Returned</option>
                        </select>
                        <button
                            onClick={() => {
                                applyFilter(selectFilter, setOrders)
                            }}
                            className="border pl-1 pr-1">
                            Apply
                        </button>
                    </div>
                </div>
                {renderOrders}
            </div>
        }
        </>
    )
}