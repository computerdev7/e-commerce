export function throttle(func, delay){
    let lastTime = 0;
    return (...args) => {
        let now = Date.now()
        if(now - lastTime >= delay){
            func.apply(this, args)
            lastTime = now;
        }
    }
}
