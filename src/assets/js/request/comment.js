// 评论

import {pixivGetRequest} from "@/assets/js/request/request";
import {replacePrefix} from "@/assets/js/request/illust";

export const getRootComment = ({pid,offset=0,limit=50})=>{
    return pixivGetRequest({
        url:'/ajax/illusts/comments/roots',
        params:{
            illust_id:pid,
            offset,limit,lang:'zh'
        }
    }).then(res=> parseComment(res.body))
}

export const getRepliesOfComment = ({cid,page=1})=>{
    return pixivGetRequest({
        url:'/ajax/illusts/comments/replies',
        params:{
            comment_id:cid,
            lang:'zh',page
        }
    }).then(res=> parseComment(res.body))
}

const parseComment = (body)=>{
    const {hasNext} = body
    const comments = body.comments.map(item =>{
        const {comment,commentDate,hasReplies,id,img,userId,userName,stampId} = item
        const author = {
            id: Number(userId),
            name: userName.split("@")[0],
            avatar: replacePrefix(img)
        }
        const data ={
            // url("https://s.pximg.net/common/images/stamp/generated-stamps/302_s.jpg?20180605")
            stampId,
            content:comment,
            timestamp:commentDate,
            hasReplies,
            id:Number(id),
        }
        return {author,comment:data}
    })

    return {comments,hasNext};
}