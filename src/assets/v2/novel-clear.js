import {DateUtils} from "gin-utils/dist/utils/DateUtils";

function clearNovel(item) {
    item.id = Number(item.id)
    item.uid = Number(item.userId)
    item.r18 = !!item.xRestrict
    item.r18g = !!item.restrict
    item.coverUrl = item.url
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

}

export const clearNovelInfo = function (novel) {
    clearNovel(novel)
}

