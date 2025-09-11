import imageCompression from 'browser-image-compression';

export async function compressImage(e) {
    let imageFile = e[0]
    let imageFiles = e;

    if(e.length > 6 || e.length < 4){
        return 2;
    }

    function checkFileRes(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.src = URL.createObjectURL(file)

            img.onload = async () => {
                resolve({width : img.width, height: img.height})
            }
            img.onerror = reject;
        })
    }

    for (let i = 0; i < imageFiles.length; i++) {
        
        let {width, height} = await checkFileRes(imageFiles[i])

            if (width > 2000 || height > 2000 || width < 800 || height < 600) {
                return 0
            }
        

        if (imageFiles[i].size > 1024 * 1024) {
            return 1
        }
    }


    let sizes = [300, 800, 1600];

    let compressImageArr = [];
    for (let i = 0; i < 3; i++) {
        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: sizes[i],
            useWebWorker: true
        }

        let compressimg = await imageCompression(imageFile, options).then(res => {
            compressImageArr.push(res)
        })

    }
    for (let i = 1; i < imageFiles.length; i++) {
        for (let j = 1; j < 3; j++) {

            const options = {
                maxSizeMB: 0.3,
                maxWidthOrHeight: sizes[j],
                useWebWorker: true
            }

            let compressimg = await imageCompression(imageFiles[i], options).then(res => {
                compressImageArr.push(res)
            })
        }

    }
    console.log(compressImageArr)
    return compressImageArr

}