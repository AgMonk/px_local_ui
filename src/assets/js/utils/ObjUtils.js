export const getTypeOf = function (obj) {
    let type = Object.prototype.toString.call(obj);
    return type.replace("[object ", "").replace("]", "");
}

export const copyObj = (obj) => JSON.parse(JSON.stringify(obj))
