import ProductStructure from "../../component/productDetailsStructure"
import productStore from "../../stores/productStore"
import { useParams } from "react-router";

export default function UpdateProduct(){

    let {updateProduct, getProduct} = productStore();
    let { id } = useParams()

    return (
        <>
        <ProductStructure func={updateProduct} getFunc={getProduct} type={'UPDATE'} id={id} />
        </>
    )
}