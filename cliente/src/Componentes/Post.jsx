import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import BotonLike from '../Componentes/BotonLike';
import Comentar from './Comentar';
import { toggleLike } from '../Helpers/post-helpers';

export default function Post({ post, actualizarPost, mostrarError }) {
    const {
        numLikes,
        numComentarios,
        comentarios,
        _id,
        caption,
        url,
        usuario,
        estaLike
    } = post;/*destructuramos el objeto post. Este es cada post dentro del JSON con posts que ya obtuvimos*/

    const [enviandoLike, setEnviandoLike] = useState(false);/*cuando el usuario hace render, no le estamos dando like a nada*/

    async function onSubmitLike() {
        /*si estamos en proceso de enviar un like, no queremos que el usuario pueda dar varias veces like y hacer varias llamadas. Prevenimos eso usando useState*/
        if (enviandoLike) {
            return;
        }

        try {
            setEnviandoLike(true)
            const postActualizado = await toggleLike(post)
            actualizarPost(post, postActualizado)
            setEnviandoLike(false)
        } catch (error) {
            setEnviandoLike(false)
            mostrarError('Hubo un problema modificando el like. Intenta de nuevo.')
            console.log(error)
        }
    }

    return (
        <div className="Post-Componente">
            <Avatar usuario={usuario} />
            <img src={url} alt={caption} className="Post-Componente__img"/>

            <div className="Post-Componente__acciones">
                <div className="Post-Componente__like-container">
                    <BotonLike onSubmitLike={onSubmitLike} like={estaLike}></BotonLike>
                </div>{/*onSubmitLike no funciona todavia.*/}
                <p>Liked por {numLikes} personas</p>
                <ul>
                    <li>
                        <Link to={`/perfil/${usuario.username}`}>
                            <b>{usuario.username}</b>
                        </Link>{' '}
                        {caption}
                    </li>    
                    <VerTodosLosComentarios id={_id} numComentarios={numComentarios}/>
                    <Comentarios comentarios={comentarios} />
                    
                </ul>
            </div>
            <Comentar />
        </div>
    )
}/*queremos que por cada post en nuestro componente feed, vamos a hacer render de una instancia de este componente*/


function VerTodosLosComentarios({ _id, numComentarios }) {
    if (numComentarios < 4) {
        return null;
    }

    return (
        <li className="text-grey-dark">
            <Link to={`/post/${_id}`}>{/*todavia no implementamos esto. es para ir al post en si*/}
                ver los {numComentarios} comentarios
            </Link>
        </li>
    )
}

function Comentarios({ comentarios }) {
    if (comentarios.length === 0) {
        return null;
    }

    return comentarios.map((comentario) => {
        return (
            <li key={comentario.id}>
                <Link to={`/perfil/${comentario.usuario.username}`}>
                    <b>{comentario.usuario.username}</b>
                </Link>{' '}
                {comentario.mensaje}
            </li>
        )
    })
}