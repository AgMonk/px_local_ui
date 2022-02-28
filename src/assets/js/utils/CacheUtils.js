// 缓存方法
/**
 * 先检查缓存对象中是否存在数据 ，如果存在且在有效时间内 ，直接使用缓存数据，否则使用请求方法请求，请求成功后写入缓存
 * @param cacheObj 缓存对象
 * @param key key
 * @param expires 有效时间（秒）
 * @param requestMethod 请求方法
 * @param force 是否强制发送请求
 */
export const getFromCache = ({cacheObj, key, requestMethod, expires = 60, force = false}) => {
    const time = Math.floor(new Date().getTime() / 1000)
    if (!force && cacheObj.hasOwnProperty(key) && time - cacheObj[key].time < expires) {
        console.log("从缓存读取数据 " + key)
        const body = JSON.parse(JSON.stringify(cacheObj[key].body));
        console.log(body)
        return new Promise((r) => r(body))
    }
    return requestMethod().then(body => {
        console.log("数据写入缓存 " + key)
        console.log(body)
        cacheObj[key] = {body, time}
        return JSON.parse(JSON.stringify(body));
    })
}