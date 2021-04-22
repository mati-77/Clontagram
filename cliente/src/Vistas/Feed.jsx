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

export default function Feed({ mostrarError }) {
    const [posts, setPosts] = useState([]);
    const [cargandoPostsIniciales, setCargandoPostsIniciales] = useState(true);/*es true porque queremos que cuando renderice, carge los posts*/

    useEffect(() => {
        async function cargarPostsIniciales() {
            try {
                const nuevosPosts = await cargarPosts();
                setPosts(nuevosPosts);/*se cargan los posts y se guardan en el estado*/
                console.log(nuevosPosts);
                setCargandoPostsIniciales(false);
            } catch (error) {
                mostrarError('Hubo un problema cargando tu feed');
                console.log(error);
            }
        }

        cargarPostsIniciales();
    }, []);/*recordar que esto se ejecuta cuando el componente termina de hacer render*/

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
                    posts.map(post => (<Post key={post._id} post={post}/>))/*retorno la instancia de un componente Post */
                }{/*transformamos cada uno de esos objetos en un componente tipo Post.*/}
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
