import { useRef } from "react";
import userProductStore from "../stores/userProductStore";
import { useNavigate } from "react-router";
import store_util from "../stores/store_util";

export default function RenderProductCat({ productArray, category }) {

    let scrollRef = useRef(null);
    let { addToCart } = userProductStore()
    let {setProduct_id} = store_util();
    let navigate = useNavigate()

    function scroll(dir) {

        if (scrollRef.current) {
            let scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: dir === 'next' ? scrollAmount : -scrollAmount,
                behavior: "smooth",
            })
        }

    }

    let renderInnerProducts = productArray?.map((el) => {

        return (
            <>
                <div
                onClick={()=> {
                    setProduct_id({id : el._id, cond : true})
                }}
                className="min-h-48 w-48 flex-shrink-0 bg-amber-600 rounded-2xl flex justify-center items-center flex-col overflow-hidden">
                    <div className="h-33 w-full overflow-hidden">
                        <img className="lazy object-contain" src={el.imageUrl.image300} />
                    </div>
                    <div className="min-h-15 w-full pl-3 pr-3 bg-green-200 flex flex-col ">
                        <div className="w-full">
                            <p className="text-left">{el.product_name}</p>
                        </div>
                        <div className="w-full flex justify-between items-center">
                            <p className="text-left">₹{el.price}</p>
                            <button
                                onClick={() => {
                                    addToCart(el._id)
                                        .then(res => console.log(res))
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
            <>
                <div className="h-72 bg-amber-100 relative">
                    <div className="h-15 bg-amber-200 flex justify-between pl-5 pr-5 items-center">
                        <p>{category}</p>
                        <button
                        onClick={()=> {
                            navigate('/searchpage',{ state : {category} })
                        }}
                        >
                            more
                        </button>
                    </div>
                    <button className="absolute right-8 bottom-24 border rounded-2xl p-3"
                        onClick={() => {
                            scroll('next')
                        }}
                    >Next</button>
                    <button className="absolute left-8 bottom-24 border rounded-2xl p-3"
                        onClick={() => {
                            scroll('prev')
                        }}
                    >Previous</button>
                    <div ref={scrollRef} className="h-57 flex justify-start items-center p-3 gap-3 overflow-x-scroll scrollbar-hide">
                        {renderInnerProducts}
                    </div>
                </div>
            </>
        </>
    )
}