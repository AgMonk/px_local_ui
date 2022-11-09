import {emoji} from "@/assets/v2/emoji";

export const clearComment = function (item) {
    item.id = Number(item.id)
    item.uid = Number(item.userId)
    item.author = {
        avatar: item.img, name: item.userName, id: Number(item.userId)
    }
    item.stampId && (item.stampId = Number(item.stampId))
    item.commentUserId && (item.commentUserId = Number(item.commentUserId))
    item.commentRootId && (item.commentRootId = Number(item.commentRootId))
    item.commentParentId && (item.commentParentId = Number(item.commentParentId))
    item.replyToUserId && (item.replyToUserId = Number(item.replyToUserId))

    //替换回复中的emoji为img标签
    if (item.comment) {
        const pattern = /\((.+?)\)/g
        let matcher = undefined;
        while (matcher = pattern.exec(item.comment)) {
            let s = matcher[0]
            let key = matcher[1]
            if (emoji.hasOwnProperty(key)) {
                item.comment = item.comment.replace(s, `<img style="width: 50px" src="https://s.pximg.net/common/images/emoji/${emoji[key]}.png" alt=""/>`)
            }
        }
    }

    delete item.replyToUserName;
    delete item.stampLink;
    delete item.img
    delete item.userName
    delete item.userId

    return item;
}

export const clearComments = function (array) {
    array.forEach(i => clearComment(i))
}