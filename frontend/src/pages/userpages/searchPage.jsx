import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router"
import userProductStore from "../../stores/userProductStore";
import FilterSearchPage from "../../component/filterSearchPage.jsx";
import SearchSuggestion from "../../component/searchSuggestion.jsx";
import ShowUserProducts from "../../component/showUserProducts.jsx";

export default function SearchPage() {

    let [searchText, setSearchText] = useState('');
    let { searchProduct, searchSuggestion } = userProductStore();
    let navigate = useNavigate();
    let [page, setPage] = useState(1);
    let [product, setProduct] = useState([]);
    let location = useLocation()
    let [showCategory, setShowCategory] = useState(false);
    let [chooseCategory, setChooseCategory] = useState('')
    let [choosePrice, setChoosePrice] = useState('')
    let [searchSuggest, setSearchSuggest] = useState([])


    useEffect(() => {
        if (location.state?.category) {

            searchProduct('', page, location.state.category, '')
                .then(res => {
                    setShowCategory(true)
                    setChooseCategory(location.state.category)
                    setProduct(res.data.message)
                })
        }
    }, [])

    return (
        <>
            <div className="h-screen w-screen overflow-hidden">
                <div className="min-h-1/12 w-full bg-gray-800 flex flex-col gap-4 items-center p-5 text-white">
                    <div className="w-full h-1/12 flex justify-between">
                        <p>BuyYouLike</p>
                        <div className="flex justify-center items-center gap-10">
                            <div className="w-2/4 relative">
                                <input className="border border-white"
                                    value={searchText} onChange={(e) => {

                                        if (e.currentTarget.value != 0) { //search suggestion
                                            searchSuggestion(e.currentTarget.value)
                                                .then(res => setSearchSuggest(res))
                                        } else {
                                            setSearchSuggest([])
                                        }

                                        setSearchText(e.currentTarget.value)

                                        searchProduct(e.currentTarget.value, 1, chooseCategory, choosePrice)
                                            .then(res => setProduct(res.data.message))
                                        setPage(1)
                                    }} />
                                <SearchSuggestion searchSuggest={searchSuggest} setSearchSuggest={setSearchSuggest} setSearchText={setSearchText} />
                            </div>
                            <button
                                onClick={() => {
                                    searchProduct(searchText, page, chooseCategory, choosePrice)
                                        .then(res => setProduct(res.data.message))
                                }}
                            >Search</button>
                            <button
                                onClick={() => {
                                    setShowCategory(prev => !prev)
                                }}
                            >
                                Filter
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/cart')
                                }}
                            >CART</button>
                        </div>
                    </div>
                    {showCategory &&
                        <FilterSearchPage chooseCategory={chooseCategory} setChooseCategory={setChooseCategory} choosePrice={choosePrice} setChoosePrice={setChoosePrice} />
                    }
                </div>
                <div className="h-11/12 flex justify-center items-center p-5 bg-gray-600">
                    {product.length == 0 ?
                        <h1
                            className="text-3xl text-gray-400"
                        >Browse Product or Category</h1>
                        :
                        <ShowUserProducts setPage={setPage} page={page} searchText={searchText} chooseCategory={chooseCategory} choosePrice={choosePrice} setProduct={setProduct} product={product} />
                        }
                </div>
            </div>
        </>
    )
}