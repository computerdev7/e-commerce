import useAuthStore from "../../stores/authStore.jsx"
import VendorAuthTemplate from "../../component/VendorAuthTemplate"

export default function VendorSignup(){

    let {vendorSignup} = useAuthStore()

    return (
        <>
        <VendorAuthTemplate Func={vendorSignup} what={'Singup'}/>
        </>
    )
}