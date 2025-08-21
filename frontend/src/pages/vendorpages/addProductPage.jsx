import productStore from "../../stores/productStore";
import { useState } from "react";
import { useNavigate } from "react-router";
import { compressImage } from "../../utils/imageCompression";
import vendorPreSigned from "../../stores/vendor_presignedUrl";

export default function AddProduct() {

    let { addProduct } = productStore();
    let { putImageOnS3 } = vendorPreSigned();
    let [imageData, setImageData] = useState('');
    let [productName, setProductName] = useState('')
    let [productPrice, setProductPrice] = useState(0)
    let [showLoading, setShowLoading] = useState(true)
    let [category,setCategory] = useState('')
    let navigate = useNavigate()

    console.log(category)

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
                        <option value={'electronic'}>Electronic</option>
                        <option value={'software'}>Software</option>
                        <option value={'decoration'}>Decoration</option>
                        <option value={'cloth'}>Clothing</option>
                        <option value={'health'}>Health</option>
                        <option value={'makup'}>Make-up</option>
                        <option value={'furniture'}>Furniture</option>
                        <option value={'home-essential'}>Home-Essential</option>
                        <option value={'grocery'}>Grocery</option>
                        <option value={'grocery-food'}>Grocery-food</option>
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