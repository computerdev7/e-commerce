import productStore from "../../stores/productStore"
import { useState } from "react";
import { useNavigate } from "react-router";

export default function AddProduct() {

    let {addProduct} = productStore();
    let [productName , setProductName] = useState('')
    let [productPrice , setProductPrice] = useState(0)
    let navigate = useNavigate()

    return (
        <>
            <div className="w-screen h-screen flex justify-center items-center flex-col gap-5">
                <div>
                    <p>ADD PRODUCT</p>
                </div>
                <div className="flex justify-center items-center flex-col gap-2">
                    <input type="text" className="border p-2" placeholder="product_name" value={productName} onChange={(e)=> setProductName(e.currentTarget.value)}/>
                    <input type="number" className="border p-2" placeholder="price" value={productPrice} onChange={(e)=> setProductPrice(e.currentTarget.value)}/>
                </div>
                <div>
                    <button className="border border-b p-2 w-32"
                    onClick={()=> {
                        addProduct(productName,productPrice)
                        .then(res => console.log(res))
                        navigate('/vendorhome')
                    }}
                    >ADD</button>
                </div>
            </div>
        </>
    )
}