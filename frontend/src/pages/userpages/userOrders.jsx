import { useEffect, useState } from "react"
import axios from "axios"
import userOrder from "../../stores/userOrder";
import ProductPage from "../userpages/productPage.jsx"
import store_util from "../../stores/store_util.jsx";
import RenderUserOrder from "../../component/renderUserOrder.jsx";

export default function UserOrder() {

    let [orders, setOrders] = useState([]);
    let [selectFilter, setSelectFilter] = useState('all');
    let {  applyFilter } = userOrder();
    let { product_id } = store_util()

    useEffect(() => {

        axios.get(`http://localhost:3000/userorder/getorders?o=${selectFilter}`, {
            withCredentials: true
        })
            .then(res => setOrders(res.data.message))

    }, [])

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
                <RenderUserOrder orders={orders} setOrders={setOrders}/>
            </div>
        }
        </>
    )
}