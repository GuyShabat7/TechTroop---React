import { useState } from 'react'

const Exercise1 = () => {
    const [gallery, setGallery] = useState({
        images: [
            "https://hips.hearstapps.com/hmg-prod/images/lychee-fruit-sugar-1530136136.jpg?crop=1xw:1xh;center,top&resize=640:*",
            "https://hips.hearstapps.com/hmg-prod/images/mango-fruit-sugar-1530136260.jpg?crop=1xw:1xh;center,top&resize=640:*",
            "https://hips.hearstapps.com/hmg-prod/images/cherries-sugar-fruit-1530136329.jpg?crop=1xw:1xh;center,top&resize=640:*",
        ],
        currentImg: 0
    })

    const shiftImageBack = () => {
        setGallery({
            ...gallery,
            currentImg: (gallery.currentImg - 1 + gallery.images.length) % gallery.images.length
        })
    }

    const shiftImageForward = () => {
        setGallery({
            ...gallery,
            currentImg: (gallery.currentImg + 1) % gallery.images.length
        })
    }
    return (
        <div>
            <button className="back" onClick={shiftImageBack}>Previous</button>
            <button className="forward" onClick={shiftImageForward}>Forward</button>
            <img src={gallery.images[gallery.currentImg]} alt="" />
        </div>
        

    )
    
}

export default Exercise1