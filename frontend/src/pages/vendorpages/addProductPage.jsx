import productStore from "../../stores/productStore";
import { useState } from "react";
import { useNavigate } from "react-router";
import { compressImage } from "../../utils/imageCompression";
import vendorPreSigned from "../../stores/vendor_presignedUrl";
import { useEffect } from "react";
import categoryStore from "../../stores/categoryStore.jsx";

export default function AddProduct() {

    let { addProduct } = productStore();
    let { putImageOnS3 } = vendorPreSigned();
    let {getCategory} = categoryStore();
    let [imageData, setImageData] = useState('');
    let [productName, setProductName] = useState('')
    let [productPrice, setProductPrice] = useState(0)
    let [showLoading, setShowLoading] = useState(true)
    let [category,setCategory] = useState('')
    let [categoryArray,setCategoryArray] = useState([])
    let navigate = useNavigate()

    useEffect(()=> {
        
        getCategory()
        .then(res=> setCategoryArray(res.data.message[0].product_categories))

    },[])

    let rendorCategory = categoryArray?.map((e)=> {
        return (
            <>
            <option value={e}>{e}</option>
            </>
        )
    })

    return (
        <>
            <div className="w-screen h-screen flex justify-center items-center flex-col gap-5">
                <div>
                    <p>ADD PRODUCT</p>
                </div>
                <div className="flex justify-center items-center flex-col gap-2">
                    <input type="text" className="border p-2" placeholder="product_name" value={productName} onChange={(e) => setProductName(e.currentTarget.value)} required />
                    <input type="number" className="border p-2" placeholder="price" value={productPrice} onChange={(e) => setProductPrice(e.currentTarget.value)} required />
                    <input type="file" className="border p-2 w-1/2" onChange={async (e) => {
                        await compressImage(e).then(res => {
                            if(res == 0){
                                alert('resolution out of bound')
                            } else if(res == 1){
                                alert('img size is out of')
                            } else {
                                setImageData(res)
                                setShowLoading(false)
                            }
                        })
                    }} required/>
                    <select
                    value={category}
                    onChange={(e)=> setCategory(e.currentTarget.value)}
                    className="border p-2"
                    required
                    >
                        <option value={''}>select options</option>
                        {rendorCategory}
                    </select>
                </div>
                <div>
                    <button disabled={showLoading ? true : false} className="border border-b p-2 w-32 disabled:border-gray-500 disabled:text-gray-600"
                        onClick={() => {
                            addProduct(productName, productPrice, category)
                                .then(res => {
                                    console.log(res.data.message, imageData)
                                    putImageOnS3(res.data.message, imageData)
                                    .then(res=> navigate('/vendorhome'))
                                })
                        }}
                    >ADD</button>
                </div>
            </div>
        </>
    )
}