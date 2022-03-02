// 评论

import {pixivGetRequest} from "@/assets/js/request/request";

export const getRootComment = ({pid,offset=0,limit=50})=>{
    return pixivGetRequest({
        url:'/ajax/illusts/comments/roots',
        params:{
            illust_id:pid,
            offset,limit,lang:'zh'
        }
    }).then(res=> {
        const body = res.body
        const {hasNext} = body
        const comments = body.comments.map(item =>{
            const {comment,commentDate,hasReplies,id,img,userId,userName} = item
            const author = {
                id:Number(userId),
                name:userName,
                avatar:img.replace("https://i.pximg.net","")
            }
            const data ={
                content:comment,
                timestamp:commentDate,
                hasReplies,
                id:Number(id),
            }
            return {author,comment:data}
        })

        return {comments,hasNext};
    })
}