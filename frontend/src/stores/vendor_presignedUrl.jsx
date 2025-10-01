import { create } from "zustand";
import axios from "axios"

let vendorPreSigned = create(()=> ({
    putImageOnS3 : async(url,data)=> {

        for(let i = 0; i < url.length; i++){
            await axios.put(url[i],data[i],{
                headers : {
                    'Content-Type':'image/webp'
                }
            })
        }
        
        return true

    }
}))

export default vendorPreSigned