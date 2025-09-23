import { useEffect, useState} from "react"
import axios from "axios"
import vendorOrder from "../../stores/vendorOrder";
import store_util from "../../stores/store_util.jsx"
import ProductPage from "../userpages/productPage.jsx"
import RenderVendorProducts from "../../component/renderVendorProducts.jsx";
import { throttle } from "../../utils/throttle.js";

export default function VendorOrders() {

    let [orderProducts, setOrderProducts] = useState([]);
    let [selectFilter, setSelectFilter] = useState('all');
    let [page, setPage] = useState(1);
    let { applyFilter } = vendorOrder()
    let { product_id} = store_util();

    let handleScroll = throttle((e) => { 
        
        let { clientHeight, scrollHeight, scrollTop } = e.target
        if (clientHeight + scrollTop >= scrollHeight - 1) {
            setPage(prev => prev + 1);
            axios.get(`http://localhost:3000/vendororder/getorders?o=${selectFilter}&p=${page + 1}`, {
                withCredentials: true
            })
                .then(res => {
                    if (res.data.message.length != 0) {
                        setOrderProducts(prev => [...prev, res.data.message[0]])
                    }
                })
        }
    }, 200)

    useEffect(() => {

        axios.get(`http://localhost:3000/vendororder/getorders?o=${selectFilter}&p=${page}`, {
            withCredentials: true
        })
            .then(res => setOrderProducts(res.data.message))

    }, [])


    return (
        <> {product_id.id ?
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
                                applyFilter(selectFilter, setOrderProducts, setPage)
                            }}
                            className="border pl-1 pr-1">
                            Apply
                        </button>
                    </div>
                </div>
                <div onScroll={handleScroll} className="max-h-11/12 overflow-y-scroll flex gap-3 flex-col">
                    <RenderVendorProducts orderProducts={orderProducts} setOrderProducts={setOrderProducts} />
                </div>
            </div>
        }
        </>
    )
}