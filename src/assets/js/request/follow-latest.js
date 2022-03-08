// 关注作品

import {pixivGetRequest} from "@/assets/js/request/request";
import {parseSimpleIllustInfo} from "@/assets/js/request/illust";

export const parseTagTranslation = tagTranslation => {
    const tags = {}
    Object.keys(tagTranslation).forEach(tag => {
        const {en, zh, zh_tw} = tagTranslation[tag]
        const translation = zh || zh_tw || en;
        tags[tag] = {tag, translation}
    })
    return tags;
};

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
        const tags = parseTagTranslation(tagTranslation);

        const {illusts, authors} = parseSimpleIllustInfo(illust, tags)

        return {tags, authors, illusts}
    })
}
