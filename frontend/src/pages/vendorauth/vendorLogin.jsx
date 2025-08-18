import useAuthStore from "../../stores/authStore.jsx"
import VendorAuthTemplate from "../../component/VendorAuthTemplate"

export default function VendorLogin(){

    let {vendorLogin} = useAuthStore()

    return (
        <>
        <VendorAuthTemplate Func={vendorLogin} what={'Login'}/>
        </>
    )
}