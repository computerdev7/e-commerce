import { useEffect, useRef, useState, useMemo } from "react"
import categoryStore from "../stores/categoryStore.jsx"
import productStore from "../stores/productStore.jsx";
import debouncer from "../utils/debouncer.js";

export default function VendorSearchDCat({ setCategoryName, categoryName, setPrice, price, setPage, setProducts, productName, setProductName }) {

  let { getCategory } = categoryStore();
  let [categoryArray, setCategoryArray] = useState([]);
  let { getProducts, searchSuggestion } = productStore();
  let [searchSuggest, setSearchSuggest] = useState([]);
  let refSearchSuggest = useRef();

  useEffect(() => {

    getCategory()
      .then(res => setCategoryArray(res.data.message[0].product_categories))

  }, [])

  useEffect(() => {

    let value = (e) => {
      if (!refSearchSuggest.current.contains(e.target)) {
        setSearchSuggest([])
      }
    }

    window.addEventListener('click', value)

    return () => (
      window.removeEventListener('click', value)
    )

  }, [refSearchSuggest.current])

  let rendorCategory = useMemo(() => {
    return categoryArray?.map((e) => {
      return (
        <>
          <option value={e}>{e}</option>
        </>
      )
    })
  }, [])

  let renderSearchSuggestion = searchSuggest?.map((e) => {
    return (
      <>
        <div className="flex items-center justify-center bg-gray-400 w-full border-b"
          onClick={() => {
            setProductName(e)
          }}
        >
          {e}
        </div>
      </>
    )
  })

  let debouncing = useRef(
    debouncer((e) => {
      if (e.currentTarget.value != 0) {
        searchSuggestion(e.currentTarget.value)
          .then(res => setSearchSuggest(res))
      } else {
        setSearchSuggest([])
      }
    },200)
  ).current

  let handleChange = (e)=> {
    debouncing(e)
    setProductName(e.currentTarget.value)
  }

  return (
    <>
      <div className="relative w-1/4 flex justify-center items-center">
        <input className="border w-full border-b" value={productName} onChange={handleChange} />
        <div ref={refSearchSuggest} className="absolute w-full top-7 flex justify-center items-center flex-col">
          {renderSearchSuggestion}
        </div>
      </div>
      <select
        value={categoryName}
        onChange={(E) => setCategoryName(E.currentTarget.value)}
      >
        <option>select categories</option>
        {rendorCategory}
      </select>
      <select
        value={price}
        onChange={(E) => setPrice(E.currentTarget.value)}
      >
        <option>select price</option>
        <option>High - Low</option>
        <option>Low - High</option>
      </select>
      <button
        onClick={() => {
          setPage(1)
          getProducts(1, productName, categoryName, price)
            .then(res => {
              setProducts(res.data.message)
            })
        }}
      >
        apply
      </button>
    </>
  )
}