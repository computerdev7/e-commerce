import categoryStore from "../stores/categoryStore.jsx"
import { useEffect, useState } from "react"

export default function GetCategory({ chooseCategory, setChooseCategory, choosePrice, setChoosePrice }) {

    let { getCategoryU } = categoryStore();
    let [categoryArray, setCategoryArray] = useState([])

    useEffect(() => {

        getCategoryU()
            .then(res => setCategoryArray(res.data.message[0].product_categories))

    }, [])

    let rendorCategory = categoryArray?.map((e) => {
        return (
            <>
                <option value={e}>{e}</option>
            </>
        )
    })

    return (
        <>
            <div className="w-full h-1/12 flex justify-around items-center bg-gray-200 text-black">
                <select
                    value={chooseCategory}
                    onChange={(e) => setChooseCategory(e.currentTarget.value)}
                >
                    <option>choose category</option>
                    {rendorCategory}
                </select>
                <select
                    value={choosePrice}
                    onChange={(e) => setChoosePrice(e.currentTarget.value)}
                >
                    <option>Default</option>
                    <option>High - Low</option>
                    <option>Low - High</option>
                </select>
            </div>
        </>
    )
}