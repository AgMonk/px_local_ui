// 搜索

import {pixivGetRequest} from "@/assets/js/request/request";
import {parseSimpleIllustInfo} from "@/assets/js/request/illust";

export const search = (keyword, {page = 1, scd, ecd}) => {
    return pixivGetRequest({
        url: `/ajax/search/artworks/${keyword}`,
        params: {page, scd, ecd}
    }).then(res => {
        const {tagTranslation, popular, relatedTags, illustManga} = res.body

        //    标签翻译
        const tags = {}
        Object.keys(tagTranslation).forEach(tag => {
            const translation = tagTranslation[tag].zh
            tags[tag] = {tag, translation}
        })

        // 受欢迎作品
        const recent = parseSimpleIllustInfo(popular.recent, tags)
        const permanent = parseSimpleIllustInfo(popular.permanent, tags)


        const data = {tags, popular: {recent, permanent}, relatedTags}

        console.log(res.body)
        console.log(data)
    })
}