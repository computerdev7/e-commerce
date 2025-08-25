import { useEffect } from "react"
import productStore from "../stores/productStore.jsx"
import { useState } from "react"
import { useNavigate } from "react-router"

export default function VendorHome() {

  let { getProducts, deleteProduct } = productStore()
  let [products, setProducts] = useState([])
  let navigate = useNavigate();
  let [page, setPage] = useState(1);

  useEffect(() => {

    getProducts(page)
      .then(res => setProducts(res.data.message))

  }, [])

   function handleScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.target

    if (scrollTop + clientHeight >= scrollHeight - 1) {

       setPage(e => ++e);

      getProducts(page + 1)
        .then(res => {
          setProducts(prev=> ([...prev,...res.data.message]))
        })
    }
  }

  let renderProduct = (products.length > 0 ?
    products.map((e, i) => {
      
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
                onClick={()=> {
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
    :
    undefined
  )

  return (
    <>
      <div className="h-screen w-screen flex justify-center flex-col gap-3 p-8">
        <p className="text-center mt-3.5 font-bold w-full text-5xl">Welcome Vendors</p>
        <div className="w-full flex justify-between p-3 items-center">
          <p className="text-3xl">Products</p>
          <button className="p-1 border border-b"
            onClick={() => {
              navigate('/addproduct')
            }}>add</button>
        </div>
        <div className="h-3/4 w-full bg-gray-50 p-2 flex gap-1 flex-col overflow-y-scroll"
          onScroll={handleScroll}
        >
          {renderProduct}
        </div>
      </div>
    </>
  )
}