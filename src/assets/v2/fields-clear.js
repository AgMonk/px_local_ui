import {DateUtils} from "gin-utils/dist/utils/DateUtils";

export const clearR18 = function (item) {
    item.r18 = !!item.xRestrict
    item.r18g = !!item.restrict

    delete item.restrict;
    delete item.xRestrict;
}

export const clearAuthor = function (item) {
    const uid = Number(item.userId);
    item.author = {
        avatar: item.profileImageUrl,
        name: item.userName,
        id: uid
    }
    item.uid = Number(item.userId);
    item.userId = Number(item.userId);

    delete item.userId;
    delete item.userName;
    delete item.profileImageUrl;
}

export const clearDate = function (item) {
    let dates = ['createDate', 'updateDate', 'uploadDate']
    dates.forEach(key => {
        if (item.hasOwnProperty(key)) {
            item[key] = DateUtils.format(new Date(item[key]), "yyyy-MM-dd hh:mm")
        }
    })
}