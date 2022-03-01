import {pixivGetRequest} from "@/assets/js/request/request";


export const getIllustInfo = (pid) =>{
    return pixivGetRequest({url:`/ajax/illust/${pid}`}).then(res=>{
        console.log(res.body)
    }).catch(reason => {
        console.log(reason)
    })
}