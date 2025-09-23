import { useMemo } from "react"
import { calcDeliveryTime } from "../utils/calcDeliveryTime"
import store_util from "../stores/store_util"
import vendorOrder from "../stores/vendorOrder";

export default function RenderVendorProducts({ orderProducts, setOrderProducts }) {

    let { setProduct_id } = store_util();
    let { setAvailable, packaged, cancelOrder, sentOrder, getDelivery, refunded } = vendorOrder()

    function updateOrder(id, data) {
        setOrderProducts(prev => {
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
        return orderProducts?.map((e) => {

            let time = calcDeliveryTime(e.updatedAt);

            return (
                <div className="min-h-60 w-full border border-b">
                    <div onClick={() => {
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
                                    <p>{e.product_id?.quantity}</p>
                                </div>
                                <div>
                                    <p>price</p>
                                    <p>{e.product_id?.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="min-h-20 w-full p-2 relative">
                        <p className="absolute top-0 right-2 text-xs">{e?.vendor_state == 'new order' ? 'Recent Orders' : e.vendor_state == 'success' ? 'Order Delivered' : e.vendor_state == 'refunded' ? 'Orders Returned' : undefined}</p>
                        {e.available == undefined &&
                            <div className="h-20 w-full flex items-center flex-col">
                                <div className="h-7">
                                    <p className="text-center text-lg">Confirmation</p>
                                </div>
                                <div className="h-13 w-full flex flex-col">
                                    <p className="text-base">Is the product available??</p>
                                    <div className="w-1/2 flex justify-start gap-5">
                                        <button className="border p-1 text-sm"
                                            onClick={async () => {
                                                let data = await setAvailable(e._id, true)
                                                updateOrder(e._id, data)
                                            }}
                                        >
                                            available
                                        </button>
                                        <button className="border p-1 text-sm"
                                            onClick={async () => {
                                                let data = await setAvailable(e._id, true)
                                                updateOrder(e._id, data)
                                            }}
                                        >
                                            no available
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                        {(e.state == 'packaging' && e.vendor_state == 'new order') &&
                            (e.isCancelOrder == undefined &&
                                <div className="w-full h-20 flex flex-col justify-start">
                                    <p>Is your packaged packed?? so that our delivery partner can pick it up</p>
                                    <button
                                        onClick={async () => {

                                            let data = await packaged(e._id)
                                            console.log(data)
                                            updateOrder(e._id, data)
                                        }}
                                        className="border p-2 w-22">
                                        packaged
                                    </button>
                                </div>
                            )
                        }
                        {e.isCancelOrder &&
                            <>
                                <p>Order is canceled</p>
                                <button
                                    onClick={async () => {
                                        let data = await cancelOrder(e._id)
                                        updateOrder(e._id, data)
                                    }}
                                    className="p-2 border">
                                    okk
                                </button>
                            </>
                        }
                        {e.state == 'packaged' && e.vendor_state == 'new order' ?
                            <>
                                <p>Does our delivery partner taken your order ??</p>
                                <button
                                    onClick={async () => {
                                        let data = await sentOrder(e._id)

                                        updateOrder(e._id, data)
                                    }}
                                    className="p-2 border">
                                    Confirm
                                </button>
                            </> :
                            undefined
                        }
                        {e.vendor_state == 'success' && e.state == 'on delivery'
                            ?
                            <p className="text-center text-lg">Order is on the way for the customer</p>
                            :
                            (e.vendor_state == 'success' && e.state == 'delivered')
                            &&
                            <p className="text-center text-lg">Order is delivered</p>
                        }
                        {(e.vendor_state == 'refunded' && e.isRefunded == false)
                            &&
                            <>
                                <p>your product is being returned below is the reason given by the user</p>
                                <p>{e.refundfeedback}</p>
                            </>
                        }
                        {(e.state == 'on delivery' && e.vendor_state == 'refunded')
                            &&
                            <>
                                {time <= 0
                                    ?
                                    <>
                                        <p>did you get your product ?</p>
                                        <button className="p-1 text-sm border"
                                            onClick={async () => {
                                                let data = await getDelivery(e._id)
                                                updateOrder(e._id, data)
                                            }}>
                                            yes
                                        </button>
                                    </>
                                    :
                                    undefined
                                }
                            </>
                        }
                        {(e.state == 'delivered' && e.vendor_state == 'refunded' && e.isRefunded == false)
                            &&
                            <>
                                <p>please now refund the user</p>
                                <button onClick={async () => {
                                    let data = await refunded(e._id)
                                    updateOrder(e._id, data)
                                }} className="p-2 border">
                                    refund
                                </button>
                            </>
                        }
                        {(e.isRefunded == true)
                            &&
                            <p>thank you for yourt service and please solve the issue </p>
                        }
                    </div>
                </div>
            )
        })
    }, [orderProducts])

    return (
        <>
            {renderOrders}
        </>
    )
}