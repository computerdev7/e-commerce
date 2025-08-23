import { useEffect } from "react"
import categoryStore from "../stores/categoryStore"
import userProductStore from "../stores/userProductStore"
import { useState } from "react"
import { useMemo } from "react"
import { useNavigate } from "react-router"


export default function Home() {

  let { getCategoryU } = categoryStore()
  let { getUserProducts, addToCart } = userProductStore()
  let [productList, setProductList] = useState([])
  let navigate = useNavigate();

  useEffect(() => {

    getUserProducts()
      .then(res => setProductList(res.data.message))

  }, [])

  let renderCategoryProducts = useMemo(() => {
    return productList?.map((e) => {

      const category = Object.keys(e)[0]

      let renderInnerProducts = e[category].map((el) => {
        return (
          <>
            <div className="h-48 w-48 bg-amber-600 rounded-2xl flex justify-center items-center flex-col overflow-hidden">
              <div className="h-33 w-full overflow-hidden">
                <img className="lazy object-contain" src={el.imageUrl.image300} />
              </div>
              <div className="h-15 w-full pl-3 pr-3 bg-green-200 flex flex-col ">
                <div className="w-full">
                  <p className="text-left">{el.product_name}</p>
                </div>
                <div className="w-full flex justify-between items-center">
                  <p className="text-left">₹{el.price}</p>
                  <button 
                  onClick={()=> {
                    addToCart(el._id)
                    .then(res=> console.log(res))
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
          <div className="h-72 bg-amber-100">
            <div className="h-15 bg-amber-200 flex justify-center items-center">
              <p>{Object.keys(e)[0]}</p>
            </div>
            <div className="h-57 flex justify-start items-center p-3">
              {renderInnerProducts}
            </div>
          </div>
        </>
      )
    })
  }, [productList])

  console.log(productList)

  return (
    <>
      <div className="h-screen w-screen overflow-y-scroll">
        <div className="h-16 w-full bg-gray-800 flex justify-between items-center p-5">
          <p>BuyYouLike</p>
          <div className="flex justify-center items-center gap-10">
          <p>Search</p>
          <button
          onClick={()=> {
            navigate('/cart')
          }}
          >CART</button>
          </div>
        </div>
        <div className="bg-gray-700">
          <div className="h-72 bg-gray-600">
          </div>
          <div className="flex flex-col gap-3 p-3">
            {renderCategoryProducts}
          </div>
        </div>
      </div>
    </>
  )
}