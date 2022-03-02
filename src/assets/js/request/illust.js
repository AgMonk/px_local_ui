import {pixivGetRequest} from "@/assets/js/request/request";


export const getIllustInfo = (pid) => {
    return pixivGetRequest({url: `/ajax/illust/${pid}`}).then(res => {
        const {body} = res
        console.log(body)
        //处理作者信息
        const author = parseAuthorInfo(body)
        const illust = parseIllustInfo(body)

        //简略的作品数据
        const {userIllusts} = body
        const extraIllusts = Object.keys(userIllusts).reverse()
            .map(i=>userIllusts[i]).filter(i=>!!i).map(i=>parseIllustInfo(i,'简略'))

        return {illust, author, extraIllusts}
    })
}

//解析作者信息
const parseAuthorInfo = (body) => {
    const {userId, userName, userIllusts, fanboxPromotion} = body

    return {
        id: Number(userId),
        name: userName,
        illusts: Object.keys(userIllusts).map(i => Number(i)).reverse(),
        hasFanbox: !!fanboxPromotion,
    }
}
//解析作品信息
const parseIllustInfo = (body, level = '详情') => {
    const {
        id, title, description,width,height, illustType,userId
        , createDate, uploadDate, urls
        , pageCount, bookmarkCount, likeCount, commentCount, responseCount, viewCount
        , bookmarkData,url
    } = body

    const illust = {id:Number(id), title, description,width,height,level,authorId:Number(userId)}

    if (level === '详情') {
        const tagList = body.tags.tags
        illust.tags = tagList.map(i => {
            const {tag, locked, translation} = i
            return {tag, locked, translation: translation ? translation.en : undefined}
        });

        //处理url
        for (const urlsKey in urls) {
            if (urls.hasOwnProperty(urlsKey)) {
                urls[urlsKey] = replacePrefix(urls[urlsKey])
            }
        }
        if (illustType===2){
            urls.zip = urls.original
                    .substring(0, urls.original.lastIndexOf('_'))
                    .replace("img-original", "img-zip-ugoira")
                + "_ugoira1920x1080.zip";
        }
        illust.urls = urls
    }

    if (level === '简略') {
        //处理url
        if (url){
            illust.urls={
                thumb:replacePrefix(url)
            }
        }
    }


    //处理时间戳
    illust.timestamp = {
        create: new Date(createDate).toDateTime(),
        upload: new Date(uploadDate).toDateTime(),
    }

    //处理计数器
    illust.counts = {
        page: pageCount,
        bookmark: bookmarkCount,
        like: likeCount,
        comment: commentCount,
        response: responseCount,
        view: viewCount,
    }

    //收藏信息
    illust.bmkData = bookmarkData ? bookmarkData : undefined;

    //处理类型
    illust.type = illustType

    return illust
}

export const replacePrefix = (s) =>s?s.replace("https://i.pximg.net", ''):undefined