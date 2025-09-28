import userOrder from "../stores/userOrder.jsx";
import { useMemo, useState } from "react";
import { calcDeliveryTime } from "../utils/calcDeliveryTime";
import store_util from "../stores/store_util";

export default function RenderUserOrder({ orders, setOrders }) {

    let { orderIsNotAvailable, cancelOrder, delivered, returnOrder, giveOrderToDelivery } = userOrder();
    let [refundFeedback, setRefundFeedback] = useState({});
    let { setProduct_id } = store_util();

    function updateOrder( id, data) {
        setOrders(prev => {
            return prev.map((el) => {
                if (id == el._id) {
                    return data
                } else {
                    return el
                }
            })
        })
    }

    let renderOrders = useMemo(() => {
        return orders?.map((e) => {

            let time = calcDeliveryTime(e.updatedAt);

            return (
                <>
                    <div className="min-h-60 w-full border border-b">
                        <div
                            onClick={() => {
                                setProduct_id({ id: e.product_id._id, cond: true })
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
                                                        onClick={async () => {
                                                            let data = await cancelOrder(e._id)
                                                            updateOrder(e._id, data )
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
                                                                onClick={async () => {
                                                                    let data = await delivered(e._id)
                                                                    updateOrder(e._id, data)
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
                                                            <textarea value={refundFeedback[e._id]} placeholder="what is wrong in the product..."
                                                                onChange={(e) => setRefundFeedback(prev => ({ ...prev, [e._id]: e.target.value }))} className="w-4/5 h-20 resize-none border p-1"></textarea>
                                                            <div className="w-1/5 text-center">
                                                                <button
                                                                    onClick={async () => {
                                                                        let data = await returnOrder(e._id, refundFeedback[e._id])
                                                                        updateOrder(e._id, data)
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
                            {e.available == false && e.user_state == 'new order' &&
                                <>
                                    <p>Order is not available</p>
                                    <button
                                        onClick={async () => {
                                            let data = await orderIsNotAvailable(e._id)
                                            updateOrder(e._id, data)
                                        }}
                                        className="border p-2">
                                        OKK
                                    </button>
                                </>
                            }
                            {e.state == 'packaged' && e.user_state == 'refunded' &&
                                <>
                                    <p>did you give your order to delivery guy?</p>
                                    <button className="border text-sm p-1"
                                        onClick={async () => {
                                            let data = await giveOrderToDelivery(e._id)
                                            updateOrder(e._id, data)
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
    }, [orders])

    return (
        <>
            {renderOrders}
        </>
    )
}   