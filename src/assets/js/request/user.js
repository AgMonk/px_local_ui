// 用户

import {pixivGetRequest} from "@/assets/js/request/request";
import {replacePrefix} from "@/assets/js/request/illust";

export const getUserInfo = (uid)=>{
    return pixivGetRequest({
        url:`/ajax/user/${uid}`,
        params:{
            full:1,
            lang:'zh'
        }
    }).then(res=> {
        const body = res.body
        const {image,imageBig,isFollowed,name,userId,comment,following,social} = body

        const links = []
        Object.keys(social).forEach(name=>{
            const url = social[name].url
            links.push({name,url})
        })
        links.sort((a,b)=>a.name.localeCompare(b.name))
        return {
            avatar:replacePrefix(imageBig),
            avatar2:replacePrefix(image),
            id:Number(userId),
            isFollowed,name,comment,following,links,
        }
    })
}