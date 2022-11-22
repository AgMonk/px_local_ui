export const commissionClear = function (item) {
    const numberFields = ["requestId", "planId", "fanUserId", "creatorUserId",]
    numberFields.forEach(f => {
        item[f] = Number(item[f])
    })

    item.requestResponseDeadlineDatetime = new Date(item.requestResponseDeadlineDatetime)
    item.requestPostDeadlineDatetime = new Date(item.requestPostDeadlineDatetime)
}
