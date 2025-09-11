import { useEffect, useRef, useState } from "react";
import userProductStore from "../../stores/userProductStore"
import { useLocation } from "react-router";
import axios from "axios";

export default function ProductPage() {

    let { getUserProduct,addToCart } = userProductStore();
    let location = useLocation()
    let [wholeData, setWholeData] = useState([]);
    let [showImageCarousal, setImageCarousal] = useState(0);
    let [mainImageArr, setMainImageArr] = useState([]);
    let carousalImage = useRef();

    async function checkOut(){
        let order = await axios.post('http://localhost:3000/create-order',{},{
            withCredentials : true
        })

        let realD = order.data.message;

        let options = {
            key : "rzp_test_RGQBIFQYDaThcn",
            amount : realD.amount,
            currency : realD.currency,
            name : 'test',
            order_id : realD.id,
            handler : async function(response){
                let checkPayment = await axios.post('http://localhost:3000/check-order',response,{
                    withCredentials : true
                })

                if(checkPayment.status == 200){
                    console.log('payment successfull')
                } else {
                    console.log("payment unsuccessfull")
                }
            },
        }
        const rzp = new window.Razorpay(options)
        rzp.open();

    }


    useEffect(() => {
        getUserProduct(location.state.id)
            .then(res => {
                setWholeData(res.data.message[0])
                setMainImageArr([...res.data.message[0].imageExtraUrl, { image800: res.data.message[0].imageUrl.image800 }])
            })

    }, [])

    function changeImage(t) {

        if (t == 'p') {
            setImageCarousal((prev) => {
                if (prev == 0) {
                    return wholeData?.imageExtraUrl.length
                } else {
                    return prev - 1;
                }
            })
        } else if (t == 'n') {
            setImageCarousal((prev) => {
                if (prev == wholeData?.imageExtraUrl.length) {
                    return 0
                } else {
                    return prev + 1;
                }
            })
        }

    }

    useEffect(() => {

        carousalImage.current.src = mainImageArr[showImageCarousal]?.image800

    }, [showImageCarousal])

    console.log(wholeData)

    let renderShortDetails = wholeData?.product_short_details?.map((el) => {
        return (
            <>
                <div className="flex w-full justify-around items-center">
                    <p>{el.input1}</p>
                    <p>{el.input2}</p>
                </div>
            </>
        )
    })

    let renderLongDetails = wholeData?.product_long_details?.map((el) => {
        return (
            <>
                <li className="">
                    {el}
                </li>
            </>
        )
    })

    return (
        <>
            <div className="w-screen min-h-screen">
                <div className="w-full h-[500px] bg-amber-300 flex items-center justify-center ">
                    <div className="h-full w-3/5 bg-amber-100 ">
                        <div className="h-11/12 w-full bg-amber-400 flex items-center justify-center">
                            <img className="max-h-5/6 max-w-5/6" ref={carousalImage} src={wholeData?.imageUrl?.image800} />
                        </div>
                        <div className="w-full h-1/12 flex items-center justify-center gap-5 bg-red-200">
                            <button
                                onClick={() => changeImage('p')}
                            >
                                PREV
                            </button>
                            <button
                                onClick={() => changeImage('n')}
                            >
                                NEXT
                            </button>
                        </div>
                    </div>
                    <div className="h-full w-2/5 bg-amber-200 p-3 flex justify-between items-center flex-col ">
                        <div className="h-11/12 overflow-y-scroll">
                            <div>
                                <p className="text-3xl pb-5" >{wholeData?.product_name}</p>
                            </div>
                            <div>
                                <p className="text-2xl pb-5">₹{wholeData?.price}</p>
                            </div>
                            <div>
                                <p className="text pb-5">{wholeData?.product_desc}</p>
                            </div>
                            <div className="p-3 pb-5 max-h-50 flex items-center flex-col gap-2">
                                {renderShortDetails}
                            </div>
                            <ul className=" p-5 list-disc">
                                {renderLongDetails}
                            </ul>
                        </div>
                        <div className="flex justify-between items-center w-full h-1/12">
                            <button 
                            onClick={()=> {
                                addToCart(wholeData._id)
                            }}
                            className="border">
                                Add to Cart
                            </button>
                            <button 
                            onClick={checkOut}
                            className="border">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full min-h-[250px] bg-amber-600 p-5">
                    suggestions
                </div>
            </div>
        </>
    )
}