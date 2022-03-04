// 关注作品

import {pixivGetRequest} from "@/assets/js/request/request";
import {parseSimpleIllustInfo} from "@/assets/js/request/illust";

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

        const tags = {}
        Object.keys(tagTranslation).forEach(tag => {
            const {en, zh, zh_tw} = tagTranslation[tag]
            const translation = zh || zh_tw || en;
            tags[tag] = {tag, translation}
        })

        const illustList = parseSimpleIllustInfo(illust, tags)
        const illusts = illustList.map(i => i.illust)
        const authorMap = {}
        illustList.map(i => i.author).forEach(i => authorMap[i.id] = i)
        const authors = Object.keys(authorMap).map(i => authorMap[i])

        return {tags, authors, illusts}
    })
}