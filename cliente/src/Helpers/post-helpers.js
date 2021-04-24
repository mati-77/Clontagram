import Axios from 'axios';

export async function toggleLike(post) {
    const url = `/api/posts/${post._id}/likes`;
    let postConLikeActualizado;
    
    if (post.estaLike) {
        await Axios.delete(url, {});/*eliminamos el like*/
        postConLikeActualizado = {
            ...post,
            estaLike: false,
            numLikes: post.numLikes - 1
        }

    } else {
        await Axios.post(url, {});/*yo no le di like, por lo tanto queremos hacer un .post para crear ese like*/
        postConLikeActualizado = {
            ...post,
            estaLike: true,
            numLikes: post.numLikes + 1
        }
    }

    return postConLikeActualizado;/*con esto le queremos decir a react que haga render de esta nueva data, mas reciente*/
}