// 用户

import {pixivGetRequest, pixivPostWithFormDataRequest} from "@/assets/js/request/request";
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
        links.sort((a, b) => a.name.localeCompare(b.name))
        return {
            avatar: replacePrefix(imageBig),
            avatar2: replacePrefix(image),
            id: Number(userId),
            isFollowed, name: name.split("@")[0], comment, following, links,
        }
    })
}

export const follow = (uid, token) => {
    return pixivPostWithFormDataRequest({
        url: '/bookmark_add.php',
        data: {
            mode: "add",
            type: "user",
            user_id: uid,
            tag: "",
            restrict: 0,
            format: "json",
        },
        headers: {
            'x-csrf-token': token,
        }
    })
}

export const unfollow = (uid, token) => {
    return pixivPostWithFormDataRequest({
        url: '/rpc_group_setting.php',
        data: {
            mode: "del",
            type: "bookuser",
            id: uid,
        },
        headers: {
            'x-csrf-token': token,
        }
    })
}

//获取用户所有作品情况
export const getUserProfileAll = (uid) => {
    return pixivGetRequest({
        url: `/ajax/user/${uid}/profile/all`,
        params: {
            lang: 'zh'
        }
    }).then(res => {
        const body = res.body
        console.log(body)
    })
}