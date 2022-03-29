import axios from "axios";
import {validateStatus} from "@/assets/js/request/request";

export const fanboxRequest = axios.create({
    baseURL: "/fanbox-api/",
    timeout: 20000,
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
        creatorId, limit,
    }
}).then(res => res.data.body.items).then(res => res.map(item => {
    handleTimestamp(item)

    return item;
}))


export const handleTimestamp = (item) => {
    item.timestamp = {
        publish: new Date(item.publishedDatetime).toDateTime(),
        updated: new Date(item.updatedDatetime).toDateTime(),
    }
    delete item.publishedDatetime
    delete item.updatedDatetime
}