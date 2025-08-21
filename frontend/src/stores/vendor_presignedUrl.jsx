import { create } from "zustand";
import axios from "axios"

let vendorPreSigned = create((set,get)=> ({
    putImageOnS3 : async(url,data)=> {

        for(let i = 0; i < 3; i++){
            await axios.put(url[i],data[i],{
                headers : {
                    'Content-Type':'image/webp'
                }
            })
        }

        console.log(data)

        return true

    }
}))

export default vendorPreSigned