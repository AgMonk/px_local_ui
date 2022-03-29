import axios from "axios";
import {validateStatus} from "@/assets/js/request/request";

export const fanboxRequest = axios.create({
    baseURL: "/fanbox-api/",
    timeout: 20000,
    method: "get",
    validateStatus,
    headers: {}
})


export const findItem = (id) => fanboxRequest({
    url: '/post.info?postId=' + id
}).then(res => res.data.body)