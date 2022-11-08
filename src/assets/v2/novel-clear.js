import {DateUtils} from "gin-utils/dist/utils/DateUtils";

export const clearNovel = function (item) {
    item.id = Number(item.id)
    item.uid = Number(item.userId)
    item.r18 = !!item.xRestrict
    item.r18g = !!item.restrict
    item.coverUrl || (item.coverUrl = item.url)
    item.seriesId && (item.seriesId = Number(item.seriesId))
    item.author = {
        avatar: item.profileImageUrl,
        name: item.userName,
        id: Number(item.userId)
    }
    let dates = ['createDate', 'updateDate', 'uploadDate']
    dates.forEach(key => {
        if (item.hasOwnProperty(key)) {
            item[key] = DateUtils.format(new Date(item[key]), "yyyy-MM-dd hh:mm")
        }
    })

    delete item.url
    delete item.userId
    delete item.restrict;
    delete item.xRestrict;
    delete item.userName;
    delete item.profileImageUrl;

    delete item.useWordCount;
    delete item.isBookmarkable;
    delete item.isOriginal;
    delete item.titleCaptionTranslation;
    delete item.isMasked;
    delete item.isUnlisted;
    delete item.marker;

    return item
}

export const clearNovelInfo = function (novel) {
    novel.tagList = novel.tags

    delete novel.tags;
    return novel;
}
export const clearNovelDetail = function (novel) {

    novel.pageCount = Number(novel.pageCount)


    novel.tags = novel.tags.tags.map(({tag, locked, deletable}) => {
        return {tag, locked, deletable};
    })

    novel.otherNovels = Object.keys(novel.userNovels).map(i => Number(i)).reverse()
    novel.otherNovelsInfo = Object.values(novel.userNovels).filter(i => !!i).map(i => clearNovelInfo(i))

    if (novel.seriesNavData) {
        novel.seriesNavData.prev && (novel.seriesNavData.prev.id = Number(novel.seriesNavData.prev.id))
        novel.seriesNavData.next && (novel.seriesNavData.next.id = Number(novel.seriesNavData.next.id))
    }

    delete novel.isBungei;
    delete novel.suggestedSettings;
    delete novel.pollData;
    delete novel.descriptionBoothId;
    delete novel.descriptionYoutubeId;
    delete novel.comicPromotion;
    delete novel.fanboxPromotion;
    delete novel.contestBanners;
    delete novel.contestData;
    delete novel.imageResponseOutData;
    delete novel.imageResponseData;
    delete novel.imageResponseCount;
    delete novel.zoneConfig;
    delete novel.hasGlossary;
    delete novel.extraData;
    delete novel.textEmbeddedImages;
    delete novel.userNovels;
}

