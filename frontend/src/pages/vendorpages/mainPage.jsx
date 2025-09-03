import { useNavigate } from "react-router"

export default function MainHomePage() {

    let navigate = useNavigate()

    return (
        <>
            <div className="w-screen h-screen flex justify-around items-center flex-col">
                <h1>WANT TO SELL AND EARN SIGNUP</h1>
                <div className='w-1/4 flex justify-around items-center'>
                <button className="border border-b p-3"
                onClick={()=> {
                    navigate('/vendorsignup')
                }}
                >
                    SignUp
                </button>
                <button  className="border border-b p-3"
                onClick={()=> {
                    navigate('/vendorlogin')
                }}
                >
                login
                </button>
                </div>
            </div>
        </>
    )
}