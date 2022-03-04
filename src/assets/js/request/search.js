// 搜索

import {pixivGetRequest} from "@/assets/js/request/request";
import {parseSimpleIllustInfo} from "@/assets/js/request/illust";
import {distinctById} from "@/assets/js/utils/ObjUtils";

export const search = (keyword, {page = 1, scd, ecd, mode = 'all'}) => {
    return pixivGetRequest({
        url: `/ajax/search/artworks/${keyword}`,
        params: {page, scd, ecd, mode}
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
        const recentAuthors = recent.map(i => i.author)
        const permanent = parseSimpleIllustInfo(popular.permanent, tags)
        const permanentAuthors = recent.map(i => i.author)

        // 作品
        const total = illustManga.total
        const illustList = parseSimpleIllustInfo(illustManga.data, tags)
        const illusts = illustList.map(i => i.illust)
        const illustAuthors = illustList.map(i => i.author);

        const authors = distinctById([...recentAuthors, ...permanentAuthors, ...illustAuthors])

        return {tags, popular: {recent: recent.map(i => i.illust), permanent: permanent.map(i => i.illust)}, relatedTags, total, authors, illusts}
    })
}