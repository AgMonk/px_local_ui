import {pixivGetRequest, pixivPostRequest, pixivPostWithFormDataRequest} from "@/assets/js/request/request";
import {distinctById} from "@/assets/js/utils/ObjUtils";


export const getIllustInfo = (pid) => {
    return pixivGetRequest({url: `/ajax/illust/${pid}`}).then(res => {
        const {body} = res
        console.log(body)
        //处理作者信息
        const author = parseAuthorInfo(body)
        const illust = parseIllustInfo(body)

        const data = {illust, author}
        //简略的作品数据
        const {userIllusts} = body
        if (userIllusts) {
            data.userIllusts = Object.keys(userIllusts).reverse()
                .map(i => userIllusts[i]).filter(i => !!i).map(i => parseIllustInfo(i, '简略'))
        }

        return data
    })
}

//解析作者信息
export const parseAuthorInfo = (body) => {
    const {userId, userName, userIllusts, fanboxPromotion, profileImageUrl} = body

    const data = {
        id: Number(userId),
        name: userName.split("@")[0],
    };
    if (userIllusts) {
        data.userIllusts = Object.keys(userIllusts).map(i => Number(i)).reverse()
    }
    if (profileImageUrl) {
        data.avatar = replacePrefix(profileImageUrl)
    }
    if (body.hasOwnProperty('fanboxPromotion')) {
        data.hasFanbox = !!fanboxPromotion
    }
    return data
}
//解析作品信息
export const parseIllustInfo = (body, level = '详情') => {
    const {
        id, title, description, width, height, illustType, userId
        , createDate, uploadDate, urls, updateDate
        , pageCount, bookmarkCount, likeCount, commentCount, responseCount, viewCount
        , bookmarkData, url
    } = body

    const illust = {id: Number(id), title, description, width, height, level, authorId: Number(userId)}

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
        if (illustType === 2) {
            urls.zip = urls.original
                    .substring(0, urls.original.lastIndexOf('_'))
                    .replace("img-original", "img-zip-ugoira")
                + "_ugoira1920x1080.zip";
        }
        illust.urls = urls
    }

    if (level === '简略') {
        //处理url
        if (url) {
            illust.urls = {
                thumb: replacePrefix(url)
            }
        }
        illust.tags = body.tags;
    }


    //处理时间戳
    illust.timestamp = {
        create: new Date(createDate).toDateTime(),
        upload: new Date(uploadDate).toDateTime(),
        update: new Date(updateDate).toDateTime(),
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

export const replacePrefix = (s) => s ? s.replace("https://i.pximg.net", '') : undefined

export const bookmarkDel = (id, token) => {
    return pixivPostWithFormDataRequest({
        url: '/rpc/index.php',
        data: {
            mode: 'delete_illust_bookmark',
            bookmark_id: id
        },
        headers: {
            'x-csrf-token': token,
        }
    })
}

export const bookmarkAdd = (pid, token) => {
    return pixivPostRequest({
        url: '/ajax/illusts/bookmarks/add',
        data: {
            illust_id: pid,
            restrict: 0,
            comment: '',
            tags: []
        },
        headers: {
            'x-csrf-token': token,
        }
    }).then(res => {
        const {last_bookmark_id, stacc_status_id} = res.body
        return {
            bookmarkId: last_bookmark_id,
            statusId: stacc_status_id,
        }
    })
}

export const setIfExists = (src, srcKey, {des, desKey, value}) => {
    des = des ? des : src
    desKey = desKey ? desKey : srcKey
    value = value !== undefined ? value : src[srcKey]
    if (src.hasOwnProperty(srcKey)) {
        des[desKey] = value;
    }
}

export const parseSimpleIllustInfo = (array, tagsMap) => {
    if (!array || array.length === 0) {
        return {illusts: [], authors: []}
    }
    const data = array.map(body => {
        const author = parseAuthorInfo(body)
        const illust = parseIllustInfo(body, "简略")
        if (tagsMap) {
            illust.tags = illust.tags.map(tag => tagsMap[tag] ? tagsMap[tag] : {tag})
        }
        return {author, illust}
    })
    const illusts = data.map(i => i.illust)
    const authors = distinctById(data.map(i => i.author))

    return {illusts, authors}
}