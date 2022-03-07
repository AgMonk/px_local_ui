// 用户

import {pixivGetRequest, pixivPostWithFormDataRequest} from "@/assets/js/request/request";
import {parseIllustInfo, parseSimpleIllustInfo, replacePrefix} from "@/assets/js/request/illust";

export const getUserInfo = (uid) => {
    return pixivGetRequest({
        url: `/ajax/user/${uid}`,
        params: {
            full: 1,
            lang: 'zh'
        }
    }).then(res => {
        const body = res.body
        const {image, imageBig, isFollowed, name, userId, comment, following, social} = body

        const links = []
        Object.keys(social).forEach(name => {
            const url = social[name].url
            links.push({name, url})
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
        },
        headers: {'x-user-id': uid,}
    }).then(res => {
        const body = res.body
        const illust = Object.keys(body.illusts).map(i => Number(i)).reverse()
        const manga = Object.keys(body.manga).map(i => Number(i)).reverse()
        return {illust, manga}
    })
}

//获取用户作品简略数据
export const getUserProfileIllust = ({uid, ids, type, is_first_page, lang = 'zh'}) => {
    return pixivGetRequest({
        url: `/ajax/user/${uid}/profile/illusts`,
        headers: {
            'x-user-id': uid,
        },
        params: {uid, ids, work_category: type, is_first_page, lang},
    }).then(res => {
        const {works} = res.body

        return Object.keys(works).map(i => works[i]).map(i => parseIllustInfo(i, '简略'))

    })
}

/**
 * 获取用户收藏作品
 * @param uid uid
 * @param rest  公开show 不公开 hide
 * @param offset
 * @param limit
 * @param tag
 * @param lang
 * @returns {AxiosPromise}
 */
export const getUserBookmark = ({uid, rest = 'show', offset = 0, limit = 48, tag = '', lang = 'zh'}) => {
    return pixivGetRequest({
        url: `/ajax/user/${uid}/illusts/bookmarks`,
        params: {rest, offset, limit, tag, lang},
        headers: {'x-user-id': uid,}
    }).then(res => {
        return {
            total: res.body.total,
            data: parseSimpleIllustInfo(res.body.works),
        };
    })
}

export const getUserBookmarkTags = (uid, lang = 'zh') => {
    return pixivGetRequest({
        url: `/ajax/user/${uid}/illusts/bookmark/tags`,
        params: {lang},
        headers: {'x-user-id': uid,}
    }).then(res => {
        const pub = res.body['public'];
        const pri = res.body['private'];
        const compare = (a, b) => {
            if (a.tag === '未分類') {
                return -1
            }
            if (b.tag === '未分類') {
                return 1
            }
            return b.cnt - a.cnt;
        }
        pub.sort(compare)
        pri.sort(compare)
        return {pub, pri}
    })
}