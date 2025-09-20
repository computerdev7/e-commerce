import userProductStore from "../stores/userProductStore";
import { useNavigate } from "react-router";

export default function ShowUserProducts({ setPage, page, searchText, chooseCategory, choosePrice, setProduct, product }) {

    let { searchProduct, addToCart } = userProductStore();
    let navigate = useNavigate();

    function handleScroll(e) { 
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget

        if (scrollTop + clientHeight >= scrollHeight - 1) {

            setPage(e => ++e);

            searchProduct(searchText, page + 1, chooseCategory, choosePrice)
                .then(res => {
                    setProduct(e => [...e, ...res.data.message])
                })
        }
    }

    let renderProduct = product?.map((res) => { 
        return (
            <>
                <div
                onClick={()=> {
                    navigate('/productpage',{state : {id : res._id}})
                }}
                className="h-50 w-50 bg-amber-300 p-2">
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
            <div onScroll={handleScroll} className="h-full w-full overflow-y-scroll grid grid-cols-3 gap-3 p-5">
                {renderProduct}
            </div>
        </>
    )
}