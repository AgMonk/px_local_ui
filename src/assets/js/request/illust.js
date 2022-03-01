import {pixivGetRequest} from "@/assets/js/request/request";


export const getIllustInfo = (pid) => {
    return pixivGetRequest({url: `/ajax/illust/${pid}`}).then(res => {
        const {body} = res
        console.log(body)
        const {id, title, description, illustType
            , createDate, uploadDate, urls
            , userId, userName, userIllusts
            ,width,height
            ,pageCount,bookmarkCount,likeCount,commentCount,responseCount,viewCount
            ,fanboxPromotion
            ,bookmarkData
        } = body
        // 处理标签
        const tagList = body.tags.tags
        const tags = tagList.map(i => {
            const {tag, locked, translation} = i
            return {tag, locked, translation: translation ? translation.en : undefined}
        })
        //处理时间戳
        const timestamp = {
            create: new Date(createDate).toDateTime(),
            upload: new Date(uploadDate).toDateTime(),
        }
        //处理url
        for (const urlsKey in urls) {
            if (urls.hasOwnProperty(urlsKey)) {
                urls[urlsKey] = urls[urlsKey].replace("https://i.pximg.net", '')
            }
        }
        //fanbox信息
        const fanbox = fanboxPromotion?{}:undefined;
        if (fanboxPromotion){
            fanbox.id = Number(userId)
            fanbox.name = userName
            fanbox.url = `https://www.pixiv.net/fanbox/creator/${userId}`
        }
        //收藏信息
        const bmkData = bookmarkData?bookmarkData:undefined;

        //处理计数器
        const counts = {
            page:pageCount,
            bookmark:bookmarkCount,
            like:likeCount,
            comment:commentCount,
            response:responseCount,
            view:viewCount,
        }
        //处理作者信息
        const author = {
            id:Number(userId),
            name:userName,
            illusts:Object.keys(userIllusts).map(i=>Number(i)).reverse()
        }

        //处理类型
        const type = {
            id: illustType,
        }
        switch (illustType) {
            case 0:
                type.name = '插画';
                break;
            case 1:
                type.name = '漫画';
                break;
            case 2:
                type.name = '动图';
                break;
        }
        const level = '详情';
        const data = {id:Number(id), title, description, timestamp, urls, tags, type,author,level,width,height,counts,fanbox,bmkData}

        console.log(data)
        return data
    }).catch(reason => {
        console.log(reason)
    })
}