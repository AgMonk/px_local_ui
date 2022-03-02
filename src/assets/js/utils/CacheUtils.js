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
        const body = copyObj(cacheObj[key].body);
        console.log(body)
        return new Promise((r) => r(body))
    }
    return requestMethod().then(body => {
        console.log("数据写入缓存 " + key)
        console.log(body)
        cacheObj[key] = {body, time}
        return copyObj(body);
    })
}
/**
 * 检查缓存对象中是否有已缓存的数据，如果有，且符合一定条件则使用缓存数据；否则执行请求方法，请求成功后保存数据到缓存对象
 * @param cacheObj 缓存对象
 * @param key key
 * @param requestMethod 请求
 * @param force 强制发送请求
 * @param useCache 判断使用缓存数据的条件
 * @param saveCache 保存缓存数据的方法
 * @returns {Promise<unknown>|*}
 */
export const getCache = ({cacheObj,key,requestMethod,force=false,useCache,saveCache})=>{
    const cache = cacheObj[key]
    if (!force && cache && (!useCache || useCache(cache))){
        console.log("从缓存读取数据 " + key)
        const body = copyObj(cache);
        return new Promise((r) => r(body))
    }
    return requestMethod().then(body => {
        console.log("数据写入缓存 " + key)
        if (saveCache){
            saveCache(cacheObj,key,body)
        }else{
            cacheObj[key] = body
        }
        return copyObj(body);
    })
}

const copyObj = (body)=>JSON.parse(JSON.stringify(body))