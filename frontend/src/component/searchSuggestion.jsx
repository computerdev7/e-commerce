import { useEffect, useRef } from "react"

export default function SearchSuggestion({ searchSuggest, setSearchSuggest, setSearchText }) {

    let refSearchSuggest = useRef();

    useEffect(() => {

        let value = (e) => {
            if (!refSearchSuggest.current.contains(e.target)) {
                setSearchSuggest([])
            }
        }

        window.addEventListener('click', value)

        return () => (
            window.removeEventListener('click', value)
        )

    }, [refSearchSuggest.current])


    let renderSearchSuggestion = searchSuggest?.map((e) => {
        return (
            <>
                <div className="flex items-center justify-center bg-gray-400 w-full border-b"
                    onClick={() => {
                        setSearchText(e)
                    }}
                >
                    {e}
                </div>
            </>
        )
    })

    return (
        <>
            <div ref={refSearchSuggest} className="absolute w-full top-7 flex justify-center items-center flex-col">
                {renderSearchSuggestion}
            </div>
        </>
    )
}