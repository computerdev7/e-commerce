import useStore from "../../store"
import VendorAuthTemplate from "../../component/VendorAuthTemplate"

export default function VendorSignup(){

    let {vendorSignup} = useStore()

    return (
        <>
        <VendorAuthTemplate Func={vendorSignup} what={'Singup'}/>
        </>
    )
}