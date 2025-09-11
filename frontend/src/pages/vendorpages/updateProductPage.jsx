import productStore from "../../stores/productStore"
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ProductShortDetail from "../../component/productShortDetail";
import ProductLongDetail from "../../component/productLongDetail";
import categoryStore from "../../stores/categoryStore";
import { compressImage } from "../../utils/imageCompression";
import vendorPreSigned from "../../stores/vendor_presignedUrl";

export default function UpdateProduct() {

    let { updateProduct, getProduct } = productStore();
    let { putImageOnS3 } = vendorPreSigned();
    let { getCategory } = categoryStore();
    let [formData, setFormData] = useState({
        productName: '',
        productPrice: 0,
        category: '',
        subCategory: '',
        desc: '',
        quantity: ''
    })
    let navigate = useNavigate()
    let { id } = useParams()
    let [shortDetailInput, setShortDetailInput] = useState([{
        input1: '',
        input2: ''
    }])
    let [longDetailInput, setLongDetailInput] = useState([''])
    let [categoryArray, setCategoryArray] = useState([])
    let numberOfImages = useRef(0);
    let [imageData, setImageData] = useState('');
    let [showLoading, setShowLoading] = useState(true)

    let handleInput = (lable) => (e) =>
        setFormData((prev) => ({ ...prev, [lable]: e.target.value }));

    useEffect(() => {

        getProduct(id)
            .then(res => {
                console.log(res.data.message)
                setFormData(prev => ({ ...prev, productName: res.data.message[0].product_name }))
                setFormData(prev => ({ ...prev, productPrice: res.data.message[0].price }))
                setFormData(prev => ({ ...prev, desc: res.data.message[0].product_desc }))
                setFormData(prev => ({ ...prev, category: res.data.message[0].category }))
                setFormData(prev => ({ ...prev, subCategory: res.data.message[0].sub_category }))
                setFormData(prev => ({ ...prev, quantity: res.data.message[0].quantity }))
                setShortDetailInput(res.data.message[0].product_short_details)
                setLongDetailInput(res.data.message[0].product_long_details)
            })

    }, [])

    useEffect(() => {

        getCategory()
            .then(res => setCategoryArray(res.data.message[0].product_categories))

    }, [])

    let rendorCategory = categoryArray?.map((e, i) => {
        return (
            <option key={i} value={e}>{e}</option>
        )
    })



    return (
        <>
            <div className="w-screen h-screen flex items-center flex-col gap-5">
                <div>
                    <p>UPDATE PRODUCT</p>
                </div>
                <div className="flex w-full justify-center items-center flex-col gap-2 p-5">
                    <input type="text" className="border p-2 w-full" placeholder="product_name" value={formData.productName} onChange={handleInput('productName')} required />
                    <textarea className="w-full h-56 border border-b resize-none p-1" placeholder="product description" value={formData.desc} onChange={handleInput('desc')} />
                    <div className="w-full flex flex-col gap-2">

                        <div className="w-full flex justify-between">

                            <p className="text-2xl">Product details</p>
                            <button className="border p-2"
                                onClick={() => {
                                    setShortDetailInput(prev => [...prev, { input1: '', input2: '' }])
                                }}
                            >add</button>

                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <ProductShortDetail setShortDetailInput={setShortDetailInput} shortDetailInput={shortDetailInput} />
                        </div>

                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex justify-between">

                            <p className="text-2xl">About Product</p>
                            <button className="border p-2"
                                onClick={() => {
                                    setLongDetailInput(prev => [...prev, ''])
                                }}
                            >add</button>

                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <ProductLongDetail setLongDetailInput={setLongDetailInput} longDetailInput={longDetailInput} />
                        </div>

                    </div>
                    <div className="w-full flex justify-between items-center">
                        <div className="">
                            <p>set price</p>
                            <input type="number" className="border p-2 w-48" placeholder="price" value={formData.productPrice} onChange={handleInput('productPrice')} required />
                        </div>
                        <div className="">
                            <p>set category</p>
                            <select
                                value={formData.category}
                                onChange={handleInput('category')}
                                className="border p-2 w-48"
                                required
                            >
                                <option key={-1} value={''}>select options</option>
                                {rendorCategory}
                            </select>
                        </div>
                        <div className="">
                            <p>write sub-category</p>
                            <input type="text" className="border p-2 w-48" placeholder="sub-category" value={formData.subCategory} onChange={handleInput('subCategory')} required />
                        </div>
                        <div className="">
                            <p>set quantity</p>
                            <input type="number" className="border p-2 w-20" placeholder="quantity" value={formData.quantity} onChange={handleInput('quantity')} required />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="w-full flex justify-between items-center">

                        <div className="w-1/2 flex items-center gap-2">
                            <p>Choose multiple images</p>
                            <input type="file" className="border p-2 w-3/6" onChange={async (e) => {
                                setShowLoading(true)
                                numberOfImages.current = e.currentTarget.files.length
                                let data = Array.from(e.currentTarget.files)
                                await compressImage(data).then(res => {
                                    if (res == 0) {
                                        alert('resolution out of bound')
                                    } else if (res == 1) {
                                        alert('img size is out of')
                                    } else {
                                        setImageData(res)
                                        setShowLoading(false)
                                    }
                                })
                            }} required multiple />
                        </div>
                        <button disabled={showLoading ? true : false} className="border border-b p-2 w-32"
                            onClick={() => {
                                updateProduct(formData.productName, formData.productPrice, id, formData.category, formData.subCategory, formData.desc, shortDetailInput, longDetailInput, numberOfImages.current)
                                    .then(res => {
                                        console.log(res.data.message)
                                        putImageOnS3(res.data.message, imageData)
                                            .then(res => navigate('/vendorhome'))
                                    })
                                navigate('/vendorhome')
                            }}
                        >UPDATE</button>
                    </div>
                </div>
            </div>
        </>
    )
}