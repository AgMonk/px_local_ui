import {DateUtils} from "gin-utils/dist/utils/DateUtils";
import {clearAuthor, clearDate, clearR18} from "@/assets/v2/fields-clear";

export const clearSeries = function (item) {
    item.id = Number(item.id)
    item.firstNovelId = Number(item.firstNovelId)
    item.latestNovelId = Number(item.latestNovelId)

    clearAuthor(item)
    clearR18(item)
    clearDate(item)

    //总体统计
    item.total = {
        count: item.total,
        //总话数
        content: item.publishedContentCount,
        displayContent: item.displaySeriesContentCount,
        //总字数
        characters: item.publishedTotalCharacterCount,
        //总阅读时长
        readingTime: item.publishedReadingTime,
        //字数(?)
        wordCount: item.publishedTotalWordCount,
    }

    //最后发表
    item.lastPublish = DateUtils.format(new Date(item.lastPublishedContentTimestamp * 1000), "yyyy-MM-dd hh:mm")

    item.cover = item.cover.urls

    delete item.maxXRestrict
    delete item.isWatched
    delete item.isNotifying
    delete item.hasGlossary
    delete item.extraData
    delete item.zoneConfig
    delete item.publishedContentCount
    delete item.createdTimestamp
    delete item.updatedTimestamp
    delete item.firstEpisode
    delete item.publishedTotalCharacterCount
    delete item.publishedReadingTime
    delete item.publishedTotalWordCount
    delete item.lastPublishedContentTimestamp
    delete item.displaySeriesContentCount
    delete item.shareText
    delete item.isOriginal
    delete item.isConcluded
    delete item.useWordCount
}

export const clearSeriesContent = function (item) {
    item.id = Number(item.id)
    clearR18(item)

    item.counts = {
        text: item.textLength,
        character: item.characterCount,
        word: item.wordCount,
        bookmark: item.bookmarkCount,
    }

    item.index = item.series.contentOrder

    item.uploadDate = DateUtils.format(new Date(item.uploadTimestamp * 1000), "yyyy-MM-dd hh:mm")
    item.reuploadTimestamp && (item.reUploadDate = DateUtils.format(new Date(item.reuploadTimestamp * 1000), "yyyy-MM-dd hh:mm"))

    delete item.userId
    delete item.textLength
    delete item.uploadTimestamp
    delete item.reuploadTimestamp
    delete item.isBookmarkable
    delete item.wordCount
    delete item.useWordCount
    delete item.bookmarkCount
    delete item.characterCount
    delete item.series
    delete item.isOriginal

}