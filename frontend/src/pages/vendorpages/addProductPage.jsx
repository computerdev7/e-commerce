import ProductStructure from "../../component/productDetailsStructure"
import productStore from "../../stores/productStore"

export default function AddProduct(){

    let {addProduct, getProduct} = productStore();
    

    return (
        <>
        <ProductStructure func={addProduct} getFunc={getProduct} type={'ADD'} id={''} />
        </>
    )
}