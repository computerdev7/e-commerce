import axios from "axios"
import { useEffect } from "react"

export default function Home() {

  useEffect(()=> {
    async function func(){
      let data = await axios.get('http://localhost:3000/user',{
        withCredentials : true
      })

      console.log(data)
    }

    func()
  })

  return (
      <>
      <p className="text-center mt-3.5 font-bold">Welcome Users</p>
      </>
  )
}