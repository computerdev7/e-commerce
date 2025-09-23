import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { compressImage } from "../utils/imageCompression.js";
import vendorPreSigned from "../stores/vendor_presignedUrl";
import categoryStore from "../stores/categoryStore.jsx";
import ProductShortDetail from "../component/productShortDetail.jsx";
import ProductLongDetail from "../component/productLongDetail.jsx";

export default function ProductStructure({ func, getFunc, type, id }) {

    let { putImageOnS3 } = vendorPreSigned();
    let { getCategory } = categoryStore();
    let [imageData, setImageData] = useState([]);
    let [formData, setFormData] = useState({
        productName: '',
        productPrice: 0,
        category: '',
        subCategory: '',
        desc: '',
        quantity: ''
    })
    let [showLoading, setShowLoading] = useState(false)
    let [categoryArray, setCategoryArray] = useState([])
    let navigate = useNavigate()
    let [shortDetailInput, setShortDetailInput] = useState([{
        input1: '',
        input2: ''
    }])
    let [longDetailInput, setLongDetailInput] = useState([''])
    let numberOfImages = useRef(0);
    let [changePosition, setChangePosition] = useState({
        from: undefined,
        to: undefined
    })
    let [showImages, setShowImages] = useState(false)
    let [updateImages , setUpdateImages] = useState(false)

    let handleInput = (lable) => (e) =>
        setFormData((prev) => ({ ...prev, [lable]: e.target.value }));

    useEffect(() => {

        getCategory()
            .then(res => setCategoryArray(res.data.message[0].product_categories))

    }, [])

    let renderImages = imageData?.map((el, i) => {
        let url = URL.createObjectURL(el)
        return (
            <>
                <div className=" flex justify-center items-center flex-col">
                    <button onClick={() => setChangePosition(prev => ({ ...prev, to: i }))}>Put Here</button>
                    <img className='w-24 inline' src={url} />
                    <button onClick={() => setChangePosition({ from: i, to: undefined })} >Select</button>
                </div>
            </>
        )
    })

    useEffect(() => {

        if (changePosition.to != undefined && changePosition.from != undefined) {
            console.log('running')
            setImageData((el) => {
                let data1 = el[changePosition.to];
                let data2 = el[changePosition.from];
                return (
                    el.map((e) => {
                        if (e == data1) {
                            return data2
                        } else if (e == data2) {
                            return data1
                        } else {
                            return e
                        }
                    })
                )
            })
        }

    }, [changePosition])

    let rendorCategory = categoryArray?.map((e, i) => {
        return (
            <option key={i} value={e}>{e}</option>
        )
    })

    async function compressImages(e) {
        await compressImage(e).then(res => {
            if (res == 0) {
                alert('resolution out of bound')
            } else if (res == 1) {
                alert('img size is out of')
            } else if (res == 2) {
                alert('there is either less than 4 or more than 6 images')
            }
            else {
                setImageData(res)
                console.log(res)
                setShowLoading(false)
            }
        })
    }

    useEffect(() => {

        if (type == 'UPDATE') {

            getFunc(id)
                .then(res => {
                    console.log(res.data.message)
                    setFormData(prev => ({ ...prev, 
                        productName: res.data.message[0].product_name, 
                        productPrice : res.data.message[0].price,
                        desc : res.data.message[0].product_desc, 
                        category : res.data.message[0].category, 
                        subCategory : res.data.message[0].sub_category,
                        quantity : res.data.message[0].quantity }))
                    setShortDetailInput(res.data.message[0].product_short_details)
                    setLongDetailInput(res.data.message[0].product_long_details)
                })
        }

    }, [])

    return (
        <>
            <div className="w-screen h-screen flex items-center flex-col gap-5">

                <div>
                    <p> {type} PRODUCT</p>
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
                            >{type}</button>

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
                            >{type}</button>

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
                    <div className="w-full flex justify-between items-center">
                        <div className="w-1/2 flex items-center gap-2">
                            <p>Choose multiple images</p>
                            <input disabled={updateImages? false : true} type="file" className="border p-2 w-3/6" onChange={async (e) => {
                                numberOfImages.current = e.currentTarget.files.length
                                if(type != 'UPDATE' && !updateImages){
                                    setShowLoading(true)
                                    setShowImages(true)
                                    setImageData(Array.from(e.currentTarget.files))
                                }
                            }} required multiple />
                        </div>
                        { type == 'UPDATE' &&
                        <button 
                        onClick={()=> {
                            setUpdateImages(prev=> !prev)
                        }}
                        className="p-2 border">
                            {updateImages? "update images : true" : 'update images : false'}
                        </button>
                        }
                        <button disabled={showLoading ? true : false} className="border border-b p-2 w-32 disabled:border-gray-500 disabled:text-gray-600"
                            onClick={() => {
                                func(formData.productName, formData.productPrice, id, formData.category, formData.subCategory, formData.desc, shortDetailInput, longDetailInput, numberOfImages.current, formData.quantity, updateImages)
                                    .then(res => {
                                        if(type != 'UPDATE' && !updateImages ){
                                            putImageOnS3(res.data.message, imageData)
                                                .then(res => navigate('/vendorhome'))
                                        } else {
                                            navigate('/vendorhome')
                                        }
                                    })
                            }}
                        >{type}</button>
                    </div>
                    {showImages &&
                        <>
                            <div className="w-full flex items-center gap-5">
                                {renderImages}
                            </div>
                            <button
                                onClick={async () => {
                                    setShowImages(false)
                                    await compressImages(imageData)
                                }}
                                className="border border-b">
                                CONFIRM
                            </button>
                        </>
                    }
                </div>
            </div>
        </>
    )
}