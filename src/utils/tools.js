export const getLoginParams = (url) => {
    let param = url.substr(1);
    let info = '';
    if (param) {
        info = param.split('=')[1]
    }    
    return info
}

export const getUrlJson = (url) => {   
    let json = {};
    let paramStr = url.split('?')[1];
    let paramList = paramStr.split('&');
    for (let item of paramList) {
        let list = item.split('=');
        json[list[0]] = list[1];
    }
    return json
}