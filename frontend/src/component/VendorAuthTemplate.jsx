import { useState } from "react";
import { useNavigate } from "react-router";

export default function VendorAuthTemplate({Func,what}) {

    let [username,setUsername] = useState('');
    let [password, setPassword] = useState('');
    let navigate = useNavigate();

    return (
        <>
            <div className="h-screen w-screen flex justify-center items-center">
                <div className="h-80 w-96 bg-amber-400 flex justify-around items-center flex-col p-5">
                    <div className="flex w-full justify-center items-center flex-col gap-5">
                        <input className="w-full p-3 "
                        value={username}
                        onChange={(e)=> setUsername(e.currentTarget.value)}
                            type="text" placeholder="username" />
                        <input className="w-full p-3"
                         value={password}
                        onChange={(e)=> setPassword(e.currentTarget.value)}
                            type='text' placeholder="password" />
                    </div>
                    <div className="border border-black w-full"></div>
                    <button className="border border-b w-1/2 p-2 rounded-3xl"
                    onClick={()=> {
                        Func(username,password,'vendor')
                        .then(res=> {
                            if(res.statusText == 'Created'){
                                navigate('/vendorhome')
                            } else if(res.statusText == 'OK'){
                                navigate('/vendorhome')
                            }
                            console.log(res)
                        })
                    }}
                    >{what}</button>
                </div>
            </div>
        </>
    )
}