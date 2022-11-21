export const userClear = function (item) {
    item.avatar = item.image
    item.avatarBig = item.imageBig
    item.id = Number(item.userId)
    delete item.image
    delete item.imageBig
    delete item.userId
}