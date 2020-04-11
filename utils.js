const debounce = (callback, delay = 1000) => {
    let timeout = null;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback.apply(null, args);
        }, delay);
    }
}//end debounce