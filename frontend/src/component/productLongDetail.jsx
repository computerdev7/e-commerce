import { useEffect } from "react"

export default function ProductLongDetail({ setLongDetailInput, longDetailInput }) {

    let renderLongDetail = longDetailInput?.map((e, i) => {

        return (
            <div className="w-full flex justify-between items-center">
                <input key={i} className="p-2 border border-b w-3/4" placeholder="About your product" value={e} onChange={(el) => {
                    let value = el.currentTarget.value
                    setLongDetailInput((prev) => {
                        return (
                            prev.map((ele, id) => {
                                if (i == id) {
                                    return value
                                } else {
                                    return ele
                                }
                            })
                        )
                    })
                }} />
                <button className="border border-b p-2"
                onClick={()=> {
                    setLongDetailInput((prev)=> {
                        return prev.filter((el,id) => id != i)
                    })
                }}
                >
                    DELETE
                </button>
            </div>


        )
    })

    return (
        <>
        {renderLongDetail}
        </>
    )
}