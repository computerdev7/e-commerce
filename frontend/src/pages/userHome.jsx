import { useEffect, useState, useMemo } from "react"
import userProductStore from "../stores/userProductStore"
import { useNavigate } from "react-router"
import RenderProductCat from "../component/renderProductsCat.jsx"
import Carousal from "../component/carousal.jsx"
import ProductPage from "./userpages/productPage.jsx"
import store_util from "../stores/store_util.jsx"

export default function Home() {

  let { getUserProducts } = userProductStore()
  let [productList, setProductList] = useState([]);
  let { product_id } = store_util();
  let navigate = useNavigate();

  useEffect(() => {

    getUserProducts()
      .then(res => setProductList(res.data.message))

  }, [])

  let renderCategoryProducts = useMemo(() => {
    return productList?.map((el) => {
      const category = Object.keys(el)[0]
      let productArray = el[category];

      return (
        <RenderProductCat category={category} productArray={productArray} />
      )
    })
  },
    [productList]
  )

  return (
    <>
      {product_id.cond ?
        <ProductPage id={product_id.id} />
        :
        <div className="h-screen w-screen overflow-y-scroll">
          <div className="h-16 w-full bg-gray-800 flex justify-between items-center p-5 text-white">
            <p>BuyYouLike</p>
            <div className="flex justify-center items-center gap-10">
              <button
                onClick={() => {
                  navigate('/vendorhome')
                }}
              >
                Sell
              </button>
              <button
                onClick={() => {
                  navigate('/searchpage')
                }}
              >Search</button>
              <button
                onClick={() => {
                  navigate('/cart')
                }}
              >CART</button>
            </div>
          </div>
          <div className="bg-gray-700">
            <div className="h-72 p-6 w-full bg-gray-600">
              <Carousal />
            </div>
            <div className="flex flex-col gap-3 p-3">
              {renderCategoryProducts}
            </div>
          </div>
        </div>
      }
    </>
  )
}