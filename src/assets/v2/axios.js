import axios from "axios";

export const PIXIV_PATH = "/pixiv-net";

export const instance = axios.create({baseURL: PIXIV_PATH, timeout: 10000})

/**
 * 精简字段
 * @param array
 * @returns {*}
 */
export const simplify = (array) => {
    return array.map(item => {
        return {
            id: item.id, uid: item.uid, bookmarked: item.bookmarked
        }
    })
}