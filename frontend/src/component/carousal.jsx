import { useEffect, useState } from "react";

export default function Carousal(){

    let [currentImages,setCurrentImages] = useState(0);

    let images = ['http://localhost:5173/1.png','http://localhost:5173/2.png','http://localhost:5173/3.png'];

    function moveCarousal(dir){

        if(currentImages === 2 && dir === 1){
            setCurrentImages(0)
        } else if(currentImages === 0 && dir === -1 ){
            setCurrentImages(2)
        } else {
            setCurrentImages(prev=> prev + dir)
        }

    }

    return (
        <>
        <div className="h-full w-full relative overflow-hidden">
        <button className="absolute right-3 top-24 border border-b p-2"
        onClick={()=> {
            moveCarousal(1,'n')
        }}
        >            
            next
        </button>
        <button className="absolute left-3 top-24 border border-b p-2"
        onClick={()=> {
            moveCarousal(-1,'p')
        }}
        >            
            prev
        </button>
            <img className="object-contain transition-all duration-300 ease-in-out" src={images[currentImages]} />
        </div>
        </>
    )
}