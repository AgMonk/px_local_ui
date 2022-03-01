import axios from "axios";

export const pixivGetRequest = axios.create({
    baseURL: "/pixiv-net/",
    timeout: 20000,
    method: "get",
    validateStatus,
})

export const pixivPostRequest = axios.create({
    baseURL: "/pixiv-net/",
    timeout: 20000,
    method: "post",
    validateStatus,
})

export const pixivPostWithFormDataRequest = axios.create({
    baseURL: "/pixiv-net/",
    timeout: 20000,
    method: "post",
    transformRequest: [
        function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0, ret.lastIndexOf('&'));
            return ret
        }
    ],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    validateStatus,
})

pixivGetRequest.interceptors.response.use(onFulfilled, onRejected);
pixivPostRequest.interceptors.response.use(onFulfilled, onRejected);
pixivPostWithFormDataRequest.interceptors.response.use(onFulfilled, onRejected);

function onRejected(error) {
    // 对请求错误做些什么
    console.log(error)
    return Promise.reject(error);
}

function onFulfilled(res) {
    // 在发送请求之前做些什么
    const {data, status, config} = res
    const {message} = data;
    const {url} = config
    if (status >= 400) {
        throw {message, status, url, data: config.data}
    }
    return data;
}

function validateStatus(status) {
    return status >= 200 && status < 500; // default
}


export const setTitle = (title)=>{
    document.title = `${title} - PLU`
}