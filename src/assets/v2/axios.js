import axios from "axios";

export const PIXIV_PATH = "/pixiv-net";

export const instance = axios.create({baseURL: PIXIV_PATH, timeout: 10000})

