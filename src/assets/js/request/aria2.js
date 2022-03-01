import axios from "axios";
import {uuid} from "@/assets/js/utils/StringUtils";

const prefix_pximg = "https://i.pximg.net"
const prefix_pxre = "https://i.pixiv.re"


const aria2Request = axios.create({
    baseURL: "/aria2",
    timeout: 2000,
    method: "post",
    validateStatus,
})

function validateStatus(status) {
    return status >= 200 && status < 600; // default
}

export const getPixivUrls = (original, count) => {
    if (original.includes('ugoira')) {
        //    动图
        return [
            prefix_pximg + original,
            prefix_pxre + original,
        ]
    }
    return [
        prefix_pximg + original.replace("_p0",`_p${count}`),
        prefix_pxre + original.replace("_p0",`_p${count}`),
    ]
}

export const addTask = ({filename, urls, dir}) => {
    const id = uuid();
    const data = {
        method: 'aria2.addUri',
        id,
        jsonrpc: 2.0,
        params: [
            urls,
            {
                dir,
                fileName: filename ? filename : urls[0].split('/').reverse()[0],
                referer: "*",
            },
        ],
    }
    return aria2Request({data}).then(res=>{
        return res.result
    })
}

export const tellStop = ()=>{
    const id = uuid();
    const data = {
        method: 'aria2.tellStopped',
        id,
        jsonrpc: 2.0,
        params: [-1,1000],
    }
    return aria2Request({data}).then(res=>{
        return res.result
    })
}

export const deleteQuest =(gid)=>{
    const id = uuid();
    const data = {
        method: 'aria2.removeDownloadResult',
        id,
        jsonrpc: 2.0,
        params: [gid],
    }
    return aria2Request({data}).then(res=>{
        return res.result
    })
}

aria2Request.interceptors.response.use(onFulfilled, onRejected);


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
