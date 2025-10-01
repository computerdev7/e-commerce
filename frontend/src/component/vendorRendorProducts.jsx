import { useNavigate } from "react-router"
import productStore from "../stores/productStore";
import { useRef } from "react";
import {throttle} from '../utils/throttle.js'
import { useMemo } from "react";

export default function VendorRendorProduct({ setPage, setProducts, productName, categoryName, price, page, products }) {
    
    let navigate = useNavigate();
    let {getProducts, deleteProduct} = productStore();

    let handleScroll = useRef(throttle((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target

    if (scrollTop + clientHeight >= scrollHeight - 1) {

      setPage(e => ++e);

      getProducts(page + 1, productName, categoryName, price)
        .then(res => {
          setProducts(prev => ([...prev, ...res.data.message]))
        })
    }
  },200)).current

  let renderProduct =  useMemo(()=> {
    products?.map((e) => {
  
        return (
          <>
            <div className="w-full p-2 flex items-center bg-gray-200 "
            >
              <div className="flex justify-center items-center flex-[0.3] ">
                <img loading="lazy" className="flex-1 " src={e.imageUrl?.image300} />
              </div>
              <div className="flex flex-[0.5] justify-between">
                <p>{e.product_name}</p>
                <p>{e.price}</p>
              </div>
              <div className="flex justify-center items-center flex-[0.2] gap-4">
                <button className="border border-b p-2"
                  onClick={() => {
                    navigate(`/updateproduct/${e._id}`)
                  }}
                >UPDATE</button>
                <button className="border border-b p-2"
                  onClick={() => {
                    deleteProduct(e._id)
                    setProducts((p) => {
                      return p.filter((el) => el._id != e._id)
                    })
                  }}
                >DELETE</button>
              </div>
            </div>
          </>
        )
      })
  },[products]) 

    return (
        <>
            <div className="h-3/4 w-full bg-gray-50 p-2 flex gap-1 flex-col overflow-y-scroll"
                onScroll={handleScroll}
            >
                {renderProduct}
            </div>
        </>
    )
}