import axios from "axios";
import {validateStatus} from "@/assets/js/request/request";

export const fanboxRequest = axios.create({
    baseURL: "/fanbox-api/",
    timeout: 30000,
    method: "get",
    validateStatus,
    headers: {}
})


export const findItem = (postId) => fanboxRequest({
    url: '/post.info',
    params: {
        postId,
    }
}).then(res => res.data.body).then(item => {
    handleTimestamp(item)

    return item
})

export const listCreator = (creatorId, limit = 300) => fanboxRequest({
    url: '/post.listCreator',
    params: {
        creatorId, limit
    }
}).then(res => res.data.body).then(res => {
    const {items} = res
    items.forEach(i => handleTimestamp(i))
    handleNextUrl(res)
    return res
})

export const listFollowing = () => fanboxRequest({
    url: '/creator.listFollowing'
}).then(res => res.data.body)

export const listHome = ({limit = 10, maxId, maxPublishedDatetime}) => fanboxRequest({
    url: '/post.listHome',
    params: {limit, maxId, maxPublishedDatetime},
}).then(res => res.data.body).then(res => {
    const {items} = res
    items.forEach(i => handleTimestamp(i))
    handleNextUrl(res)

    return res;
})


export const handleTimestamp = (item) => {
    item.timestamp = {
        publish: new Date(item.publishedDatetime).toDateTime(),
        updated: new Date(item.updatedDatetime).toDateTime(),
    }
    delete item.publishedDatetime
    delete item.updatedDatetime
}

export const handleNextUrl = (res) => {
    const nextUrl = res.nextUrl;
    if (nextUrl) {
        const a = {}
        new URL(nextUrl).search.substring(1).split("&").forEach(item => {
            const s = item.split('=')
            a[s[0]] = s[1]
        })
        res.params = a;
        delete res.nextUrl
    }
}