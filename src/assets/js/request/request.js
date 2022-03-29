import axios from "axios";

export const pixivGetRequest = axios.create({
    baseURL: "/pixiv-net/",
    timeout: 20000,
    method: "get",
    validateStatus,
    headers: {}
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
    return Promise.reject(error);
}

function onFulfilled(res) {
    // 在发送请求之前做些什么
    const {data, status, config} = res
    const {message} = data;
    const {url} = config
    if (status >= 500) {
        throw {message:'网络错误', status, url, data: config.data}
    }
    if (status >= 400) {
        throw {message, status, url, data: config.data}
    }
    return data;
}

export const validateStatus = (status) => {
    return status >= 200 && status < 600; // default
}


export const setTitle = (title, suffix = 'PLU') => {
    document.title = `${title} - ${suffix}`
}