import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import vendorOrder from "../../stores/vendorOrder";
import store_util from "../../stores/store_util.jsx"
import ProductPage from "../userpages/productPage.jsx"

export default function VendorOrders() {

    let [orderProducts, setOrderProducts] = useState([]);
    let [selectFilter, setSelectFilter] = useState('all');
    let [page,setPage] = useState(1);
    let {setAvailable, packaged, cancelOrder, sentOrder, getDelivery, refunded, applyFilter} = vendorOrder()
    let {product_id, setProduct_id} = store_util();

    function handleScroll(e) {
        let {clientHeight,scrollHeight,scrollTop} = e.target
        if(clientHeight + scrollTop >= scrollHeight) {
            setPage(prev=> ++prev);
            axios.get(`http://localhost:3000/vendororder/getorders?o=${selectFilter}&p=${page + 1}`, {
            withCredentials: true
        })
            .then(res => {
                if(res.data.message.length != 0){
                    setOrderProducts(prev=> [...prev,res.data.message])
                }
            })
        }
    }

    useEffect(() => {

        axios.get(`http://localhost:3000/vendororder/getorders?o=${selectFilter}&p=${page}`, {
            withCredentials: true
        })
            .then(res => setOrderProducts(res.data.message))

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

    let renderOrders = useMemo(()=> {
      return  orderProducts?.map((e) => {
    
            let time = calcDeliveryDate(e.updatedAt);
    
            return (
                <div className="min-h-60 w-full border border-b">
                    <div onClick={()=> {
                        setProduct_id({id: e.product_id._id , cond : true})
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
                                            onClick={() => {
                                                setAvailable(e._id, true)
                                            }}
                                        >
                                            available
                                        </button>
                                        <button className="border p-1 text-sm"
                                            onClick={() => {
                                                setAvailable(e._id, false)
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
                                        onClick={() => {
                                            packaged(e._id)
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
                                    onClick={() => {
                                        cancelOrder(e._id)
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
                                    onClick={() => {
                                        sentOrder(e._id)
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
                                            onClick={() => {
                                                getDelivery(e._id)
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
                                <button onClick={() => {
                                    refunded(e._id)
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
    },[orderProducts])
    

    return (
        <> {product_id.id?
            <ProductPage id={product_id.id} />
            :
            <div className="w-screen h-screen p-5 flex gap-3 flex-col">
                <div className="h-1/12 border flex justify-between items-center pl-5 pr-5">
                    <p>Orders</p>
                    <div className="flex justify-around items-center w-1/3">
                        <select className="border" value={selectFilter} onChange={(e) => setSelectFilter(e.target.value)}>
                            <option value={'all'}>All</option>
                            <option value="new order">Recent Orders</option>
                            <option value="success">Orders Delivered</option>
                            <option value="refunded">Returned Order</option>
                        </select>
                        <button
                            onClick={() => {
                                applyFilter(selectFilter,setOrderProducts,setPage)
                            }}
                            className="border pl-1 pr-1">
                            Apply
                        </button>
                    </div>
                </div>
                <div onScroll={handleScroll} className="max-h-11/12 overflow-y-scroll flex gap-3 flex-col">
                    {renderOrders}
                </div>
            </div>
        }
        </>
    )
}