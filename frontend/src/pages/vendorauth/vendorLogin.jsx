import useStore from "../../store"
import VendorAuthTemplate from "../../component/VendorAuthTemplate"

export default function VendorLogin(){

    let {vendorLogin} = useStore()

    return (
        <>
        <VendorAuthTemplate Func={vendorLogin} what={'Login'}/>
        </>
    )
}