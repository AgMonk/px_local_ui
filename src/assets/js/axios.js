import axios from "axios";

export const PIXIV_PATH = "/pixiv-net";

export const instance = axios.create({baseURL: PIXIV_PATH, timeout: 10000})

function clearIllust(item) {
    //格式转换
    item.id = Number(item.id)
    item.userId = Number(item.userId)
    item.uid = Number(item.userId)
    item.r18 = !!item.xRestrict
    item.r18g = !!item.restrict
    item.size = {
        width: item.width, height: item.height,
    }
    item.author = {
        avatar: item.profileImageUrl,
        name: item.userName,
        id: item.userId
    }

    delete item.titleCaptionTranslation;
    delete item.alt;
    delete item.restrict;
    delete item.isUnlisted;
    delete item.isMasked;
    delete item.height;
    delete item.width;
    delete item.xRestrict;
    delete item.userName;
    delete item.profileImageUrl;


}

//整理搜索结果
export const clearIllustInfo = function (item) {
    //tags字段改名
    item.tagList = item.tags

    clearIllust(item);

    delete item.tags;
    delete item.urls;
}

export const clearIllustDetail = function (item) {
    item.tags = item.tags.tags.map(({tag, locked, translation}) => {
        return {tag, locked, translation: translation ? translation.en : undefined}
    })

    clearIllust(item);

    const {request, userIllusts} = item
    //约稿信息
    if (request) {
        item.isCommission = true;
        const {fan} = request
        if (fan) {
            item.commissionFrom = {
                id: Number(fan.userId), name: fan.userName, avatar: fan.profileImg
            }
        }
    }

    //用户作品
    if (userIllusts) {
        item.userIllustsInfo = Object.values(userIllusts).filter(i => i).sort((a, b) => a.id - b.id)
        item.userIllustIds = Object.keys(userIllusts).sort((a, b) => a - b).map(k => Number(k))

        item.userIllustsInfo.forEach(i => clearIllustInfo(i))
    }

    delete item.request
    delete item.userIllusts
    delete item.illustId;
    delete item.illustComment;
    delete item.comicPromotion;
    delete item.contestBanners;
    delete item.storableTags;
    delete item.sl;
    delete item.userAccount;
    delete item.bookStyle;
    delete item.isHowto;
    delete item.isOriginal;
    delete item.imageResponseOutData;
    delete item.imageResponseData;
    delete item.responseCount;
    delete item.illustTitle;
    delete item.imageResponseCount;
    delete item.pollData;
    delete item.seriesNavData;
    delete item.descriptionBoothId;
    delete item.descriptionYoutubeId;
    delete item.fanboxPromotion;
    delete item.contestData;
    delete item.zoneConfig;
    delete item.extraData;
    delete item.commentOff;
    delete item.isBookmarkable;

}