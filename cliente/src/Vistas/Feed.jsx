import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Main from '../Componentes/Main';
import Loading from '../Componentes/Loading';
import Post from '../Componentes/Post';

async function cargarPosts(fechaDelUltimoPost) {
    const query = fechaDelUltimoPost ? `?fecha=${fechaDelUltimoPost}` : '';
    const { data: nuevosPosts } = await Axios.get(`/api/posts/feed${query}`);
    /*esto es porque cuando se apreta el boton para cargar nuevos posts, a la llamada le pasamos una fecha,
    para cargar los posts que vienen despues del ultimo post */

    return nuevosPosts;
}

const NUMERO_DE_POSTS_POR_LLAMADA = 3;

export default function Feed({ mostrarError, usuario }) {
    const [posts, setPosts] = useState([]);
    const [cargandoPostsIniciales, setCargandoPostsIniciales] = useState(true);/*es true porque queremos que cuando renderice, carge los posts*/
    const [cargandoMasPosts, setCargandoMasPosts] = useState(false);
    const [todosLosPostsCargados, setTodosLosPostsCargados] = useState(false);/*estado para evaluar si ya cargamos todos los posts*/

    useEffect(() => {
        async function cargarPostsIniciales() {
            try {
                const nuevosPosts = await cargarPosts();
                setPosts(nuevosPosts);/*se cargan los posts y se guardan en el estado*/
                console.log(nuevosPosts);
                setCargandoPostsIniciales(false);
                revisarSiHayMasPosts(nuevosPosts);
            } catch (error) {
                mostrarError('Hubo un problema cargando tu feed');
                console.log(error);
            }
        }

        cargarPostsIniciales();
    }, []);/*recordar que esto se ejecuta cuando el componente termina de hacer render*/


    function actualizarPost(postOriginal, postActualizado) {
        setPosts((posts) => {
            const postsActualizados = posts.map(post => {
                if (post !== postOriginal) {
                    return post;
                }

                return postActualizado;
            })
            return postsActualizados;
        })/*queremos modificar el array de posts que habiamos recibido, y cambiar el post original que haya recibido el like, por el actualizado, que ya lo recibi??. 
        Entonces, le pasamos a setPosts una funcion que retornara este array actualizado. Asi que, guardamos lo que ser?? este array en una constante, asignandole un map, que se encargar?? de recorrer el array de posts, y verificar si alguno es el que cambi??, para posteriormente reemplazarlo con el actualizado, haciendo un return postActualizado.
        De esa manera, el lugar que antes ocupaba el post viejo en el array original, ahora es ocupado por el actualizado, dentro de la constante postsActualizados.
        Ahora que ya tenemos esta constante con la actualizaci??n, la retornamos a setPosts con un return postsActualizados, para que actualice el estado posts.
        Ahora debemos llamar a esta funcion una vez que tengamos la version actualizada. Es decir, se la tenemos que pasar a nuestro componente Post*/
    }


    async function cargarMasPosts() {
        if (cargandoMasPosts) {
            return;
        }

        try {
            setCargandoMasPosts(true);
            const fechaDelUltimoPost = posts[posts.length -1].fecha_creado;/*obtenemos la fecha del ultimo post cargado, accediendo a la lista de posts*/
            const nuevosPosts = await cargarPosts(fechaDelUltimoPost);
            setPosts(viejosPosts => [...viejosPosts, ...nuevosPosts]);
            setCargandoMasPosts(false);
            revisarSiHayMasPosts(nuevosPosts);
        } catch (error) {
            mostrarError('Hubo un problema cargando los siguientes posts.');
            setCargandoMasPosts(false);
        }
    }

    function revisarSiHayMasPosts(nuevosPosts) {
        if (nuevosPosts.length < NUMERO_DE_POSTS_POR_LLAMADA) {
            setTodosLosPostsCargados(true);
        }
    }/*si se nos regresa menos de 3 posts, entendemos que ya no hay posts para la siguiente llamada*/


    if (cargandoPostsIniciales) {
        return (
            <Main center>
                <Loading/>
            </Main>
        )
    }

    if (!cargandoPostsIniciales && posts.length === 0) {
        return (
            <Main center>
                <NoSiguesANadie />;
            </Main>
        ) 
    }

    return (
        <Main center>
            <div className="Feed">
                {
                    posts.map(post => (
                        <Post 
                            key={post._id} 
                            post={post} 
                            actualizarPost={actualizarPost} 
                            mostrarError={mostrarError} 
                            usuario={usuario}
                        />))/*retorno la instancia de un componente Post */
                }{/*transformamos cada uno de esos objetos en un componente tipo Post.*/}
                <CargarMasPosts onClick={cargarMasPosts} todosLosPostsCargados={todosLosPostsCargados} />
            </div>
        </Main>
    )
}

function NoSiguesANadie() {
    return (
        <div className="NoSiguesANadie">
            <p className="NoSiguesANadie__mensaje">
                Tu feed no tiene fotos porque no sigues a nadie, o porque no han publicado fotos
            </p>
            <div className="text-center">
                <Link to="/explore" className="NoSiguesANadie__boton">
                    Explora Clontagram
                </Link>
            </div>
        </div>
    )
}

function CargarMasPosts({ onClick, todosLosPostsCargados }) {
    if (todosLosPostsCargados) {
        return <div className="Feed__no-hay-mas-posts">No hay mas posts</div>
    }

    return (
        <button className="Feed__cargar-mas" onClick={onClick}>
            Ver m??s
        </button>
    )

}/*todosLosPostsCargados es un booleano. Este componente sirve para
crear el boton de "Ver mas", o un mensaje de "No hay mas posts"*/
