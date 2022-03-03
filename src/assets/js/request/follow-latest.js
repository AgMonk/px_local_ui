// 关注作品

import {pixivGetRequest} from "@/assets/js/request/request";

export const getFollowLatest = (p) => {
    return pixivGetRequest({
        url: "/ajax/follow_latest/illust",
        params: {
            mode: 'all',
            lang: 'zh',
            p,
        },
    }).then(res => {
        const {tagTranslation} = res.body
        const {illust} = res.body.thumbnails
        console.log(tagTranslation)
        console.log(illust)

        return {tagTranslation, illust}
    })
}