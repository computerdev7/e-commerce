export default function debouncer(func, delay){
    let timeout = null;
    return function (...args){
        clearTimeout(timeout)
        timeout = setTimeout(()=> {
            func.apply(this, args)
        }, delay)
    }
}