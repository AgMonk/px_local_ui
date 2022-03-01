import {pixivGetRequest} from "@/assets/js/request/request";


export const getIllustInfo = (pid) => {
    return pixivGetRequest({url: `/ajax/illust/${pid}`}).then(res => {
        const {body} = res
        console.log(body)
        const {id, title, description, illustType, createDate, uploadDate, urls, userId, userName, userIllusts} = body
        // 处理标签
        const tagList = body.tags.tags
        const tags = tagList.map(i => {
            const {tag, locked, translation} = i
            return {tag, locked, translation: translation ? translation.en : undefined}
        })
        //处理时间戳
        const timestamp = {
            create: new Date(createDate).toDateTime(),
            upload: new Date(uploadDate).toDateTime(),
        }
        //处理url
        for (const urlsKey in urls) {
            if (urls.hasOwnProperty(urlsKey)) {
                urls[urlsKey] = urls[urlsKey].replace("https://i.pximg.net", '')
            }
        }

        //处理类型
        const type = {
            id: illustType,
        }
        switch (illustType) {
            case 0:
                type.name = '插画';
                break;
            case 1:
                type.name = '漫画';
                break;
            case 2:
                type.name = '动图';
                break;
        }
        const data = {id, title, description, timestamp, urls, tags, type}

        console.log(data)
        return data
    }).catch(reason => {
        console.log(reason)
    })
}