import axios from "axios"
import { useEffect } from "react"

export default function VendorHome() {

  useEffect(()=> {
    async function func(){
      let data = await axios.get('http://localhost:3000/vendor',{
        withCredentials : true
      })

      console.log(data)
    }

    func()
  })

  return (
      <>
      <p className="text-center mt-3.5 font-bold">Welcome Vendors</p>
      </>
  )
}