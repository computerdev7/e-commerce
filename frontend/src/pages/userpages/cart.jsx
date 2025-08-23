import { useEffect } from "react"
import userProductStore from "../../stores/userProductStore"
import { useState } from "react"

export default function Cart() {

    let { getCart, removeFromCart } = userProductStore()
    let [products, setProducts] = useState([]);

    useEffect(() => {
        getCart()
            .then(res => setProducts(res.data.message))
    }, [products])


    let renderProducts = products?.map((e) => {
        return (
            <>
                <div className="h-40 w-full flex bg-amber-400 p-3 justify-between items-center">
                    <div className="h-full w-40 overflow-hidden">
                        <img className="object-contain" src={e.imageUrl.image300} />
                    </div>
                    <div className="h-full w-52 flex justify-between items-center gap-3">
                        <p>{e.product_name}</p>
                        <button
                        onClick={()=> {
                            setProducts((prev)=> {
                                return prev.filter(el=> el._id != e.id)
                            })
                            removeFromCart(e._id)
                            .then(res=> console.log(res))
                        }}
                        >delete</button>
                    </div>
                </div>
            </>
        )
    })

    return (
        <>
            <div className="w-screen h-screen">
                <div className="h-1/12 bg-amber-300 flex items-center justify-between pl-4 pr-4">
                    <p>Cart</p>
                </div>
                <div className="h-11/12 bg-amber-100 flex items-center justify-center p-5">
                    <div className="h-full w-full bg-amber-200 overflow-y-scroll flex p-3 items-center flex-col gap-1">
                        {renderProducts}
                    </div>
                </div>
            </div>
        </>
    )
}