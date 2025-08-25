import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router"
import userProductStore from "../../stores/userProductStore";

export default function SearchPage() {

    let [searchText, setSearchText] = useState('');
    let { searchProduct, addToCart } = userProductStore();
    let navigate = useNavigate();
    let [page, setPage] = useState(1);
    let [product, setProduct] = useState([]);
    let location = useLocation()


    useEffect(() => {
        if (location.state?.category) {

            searchProduct(location.state.category, page)
                .then(res => {
                    setSearchText(location.state.category)
                    setProduct(res.data.message)
                })
        }
    }, [])

    function handleScroll(e) {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget

        if (scrollTop + clientHeight >= scrollHeight - 1) {

            setPage(e => ++e);

            searchProduct(searchText, page + 1)
                .then(res => {
                    setProduct(e => [...e, ...res.data.message])
                })
        }
    }

    let renderProduct = product?.map((res) => {
        return (
            <>
                <div className="h-50 w-50 bg-amber-300 p-2">
                    <div className="w-full h-2/3 overflow-hidden">
                        <img className="object-contain" src={res.imageUrl.image300} />
                    </div>
                    <div className="w-full h-1/3 flex flex-col">
                        <div className="w-full">
                            <p className="text-left">{res.product_name}</p>
                        </div>
                        <div className="w-full flex justify-between items-center">
                            <p className="text-left">₹{res.price}</p>
                            <button
                                onClick={() => {
                                    addToCart(res._id)
                                        .then(re => console.log(re))
                                }}
                                className="border border-b p-1">Cart</button>
                        </div>
                    </div>
                </div>
            </>
        )
    })

    return (
        <>
            <div className="h-screen w-screen ">
                <div className="h-1/12 w-full bg-gray-800 flex justify-between items-center p-5 text-white">
                    <p>BuyYouLike</p>
                    <div className="flex justify-center items-center gap-10">
                        <input className="border border-white"
                            value={searchText} onChange={(e) => setSearchText(e.currentTarget.value)} />
                        <button
                            onClick={() => {
                                searchProduct(searchText, page)
                                    .then(res => setProduct(res.data.message))
                            }}
                        >Search</button>
                        <button
                            onClick={() => {
                                navigate('/cart')
                            }}
                        >CART</button>
                    </div>
                </div>
                <div className="h-11/12 flex justify-center items-center p-5">
                    {product.length == 0 ?
                        <h1
                            className="text-3xl text-gray-400"
                        >Browse Product or Category</h1>
                        :
                        <div onScroll={handleScroll} className="h-full w-full overflow-y-scroll grid grid-cols-3 gap-3 p-5">
                            {renderProduct}
                        </div>}
                </div>
            </div>
        </>
    )
}