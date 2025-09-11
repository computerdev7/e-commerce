import { useEffect,useState } from "react"
import productStore from "../stores/productStore.jsx"
import { useNavigate } from "react-router"
import VendorSearchDCat from "../component/vendorHomeHead.jsx"
import VendorRendorProduct from "../component/vendorRendorProducts.jsx"

export default function VendorHome() {

  let { getProducts } = productStore()
  let [products, setProducts] = useState([])
  let navigate = useNavigate();
  let [page, setPage] = useState(1);
  let [productName, setProductName] = useState('');
  let [categoryName, setCategoryName] = useState('')
  let [price, setPrice] = useState('')

  useEffect(() => {

    getProducts(page, '', '', '')
      .then(res => setProducts(res.data.message))

  }, [])

  return (
    <>
      <div className="h-screen w-screen flex justify-center flex-col gap-3 p-8">
        <p className="text-center mt-3.5 font-bold w-full text-5xl">Welcome Vendors</p>
        <div className="w-full max-h-3/12 gap-3 flex justify-center items-center flex-col p-3">
          <div className="w-full flex justify-between items-center">
            <p className="text-3xl">Products</p>
            <button className="p-1 border border-b"
              onClick={() => {
                navigate('/addproduct')
              }}>add</button>
          </div>
          <div className="w-full flex justify-around items-center ">
            <VendorSearchDCat setCategoryName={setCategoryName} categoryName={categoryName} setPrice={setPrice} price={price} setPage={setPage} setProducts={setProducts} productName={productName} setProductName={setProductName} />
          </div>
        </div>
        <VendorRendorProduct setPage={setPage} page={page} setProducts={setProducts} products={products} categoryName={categoryName} productName={productName} price={price} />
      </div>
    </>
  )
}