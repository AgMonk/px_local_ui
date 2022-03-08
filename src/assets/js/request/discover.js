// 发现

import {pixivGetRequest} from "@/assets/js/request/request";
import {parseSimpleIllustInfo} from "@/assets/js/request/illust";
import {parseTagTranslation} from "@/assets/js/request/follow-latest";

export const discover = ({mode = 'all', limit = 60, lang = 'zh', sampleIllustId}) => {
    return pixivGetRequest({
        url: `/ajax/discovery/artworks`,
        params: {mode, limit, lang, sampleIllustId},
    }).then(res => {
        const body = res.body
        console.log(body)
        const {recommendedIllusts, tagTranslation, thumbnails} = body
        const illustInfo = parseSimpleIllustInfo(thumbnails.illust)
        const tags = parseTagTranslation(tagTranslation)
        const recommended = recommendedIllusts.map(item => {
            const {illustId, recommendScore} = item
            const id = Number(illustId)
            const score = Math.floor(recommendScore * 10000) / 10
            return {id, score}
        })
        recommended.sort((a, b) => b.score - a.score)
        return {tags, recommended, ...illustInfo}
    })
}