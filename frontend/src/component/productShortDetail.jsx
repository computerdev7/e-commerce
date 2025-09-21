import { useMemo } from "react"

export default function ProductShortDetail({setShortDetailInput, shortDetailInput}){

    let renderShortDetail = useMemo(()=> {
        
       return shortDetailInput?.map((e,id) => {
           
            return (
                <div key={id} className="w-full flex justify-between items-center">
                    <input value={e.input1} onChange={(el)=> {
                        let value = el.currentTarget.value
                        setShortDetailInput((prev)=> {
                            return (
                                prev.map((ele,ind)=> {
                                    if(ind == id){
                                        return {...ele,input1 : value}
                                    } else {
                                        return ele
                                    }
                                })
                            )
                        })
                    }} placeholder={`detail ${id + 1}`} type="text" className="border border-b p-2 w-5/12" />
                    <input value={e.input2} onChange={(el)=> {
                        let value = el.currentTarget.value
                        setShortDetailInput((prev)=> {
                            return (
                                prev.map((ele,ind)=> {
                                    if(ind == id){
                                        return {...ele,input2 : value}
                                    } else {
                                        return ele
                                    }
                                })
                            )
                        })
                    }} type="text" className="border border-b p-2 w-5/12" />
    
                    <button
                    className="border p-2"
                    onClick={()=> {
                        setShortDetailInput((prev)=> {
                            return(
                                prev.filter((el,i)=> i != id)
                            )
                        })
                    }}
                    >Delete</button>
    
                </div>
            )
        })

    },[shortDetailInput])
    

    return (
        <>
        {renderShortDetail}
        </>
    )
}