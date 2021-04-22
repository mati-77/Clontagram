import React, { useState } from 'react';
import Main from '../Componentes/Main';
import Loading from '../Componentes/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios';

export default function Upload({ history, mostrarError }) {
    const [imagenUrl, setimagenUrl] = useState('');
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [enviandoPost, setEnviandoPost] = useState(false);/*nuestra manera de saber si estamos enviando un post, para evitar multiples envios al apretar varias veces*/
    const [caption, setCaption] = useState('');/*estado del caption*/

    async function handleImagenSeleccionada(evento) {
        try {
            setSubiendoImagen(true);
            const file = evento.target.files[0] /*queremos acceder al archivo que el usuario selecciono*/
            
            const config = {
                headers: {
                    'Content-Type': file.type
                }
            } /*necesitamos darsela a axios, porque nuestro endpoint necesita saber el tipo de archivo.*/

            const { data } = await Axios.post('api/posts/upload', file, config); /*destructuramos la respuesta que nos da el servidor. Esa es la ruta que nos permite subir un archivo */
            setimagenUrl(data.url);
            setSubiendoImagen(false);
        } catch (error) {
            setSubiendoImagen(false);
            mostrarError(error.response.data);
            console.log(error);
        }
    }

    async function handleSubmit(evento) {
        evento.preventDefault();

        if(enviandoPost) {
            return;
        }

        if(subiendoImagen) {
            mostrarError('Mo se ha terminado de subir la imagen');
            return;
        }

        if(!imagenUrl) {
            mostrarError('Primero selecciona una imagen');
            return;
        }/*si no se da ninguna de estas tres, el usuario subio una imagen exitosamente*/

        try {
            setEnviandoPost(true)/*estamos enviando un post*/
            const body = {
                caption,
                url: imagenUrl
            };
            await Axios.post('api/posts', body)
            setEnviandoPost(false)
            history.push('/')/*nos lleva automaticamente al home, que seria nuestro feed*/
        } catch (error) {
            mostrarError(error.response.data)
        }

    }




    return(
        <Main center>
            <div className="Upload">
                <form onSubmit={handleSubmit}>
                    <div className="Upload__image-section">
                        <SeccionSubirImagen 
                            imagenUrl={imagenUrl} 
                            subiendoImagen={subiendoImagen}
                            handleImagenSeleccionada={handleImagenSeleccionada}
                        />
                    </div>
                    <textarea
                        name="caption"
                        className="Upload__caption"
                        required
                        maxLength="180"
                        placeholder="Caption de tu post."
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                    />
                    <button className="Upload__submit" type="submit">
                        Post
                    </button>
                </form>
            </div>
        </Main>
    )
}

function SeccionSubirImagen({subiendoImagen, imagenUrl, handleImagenSeleccionada}) {
    if(subiendoImagen) {
        return <Loading />
    } else if (imagenUrl) {
        return <img src={imagenUrl} alt="" />
    } else {
        return (
            <label className="Upload__image-label">
                <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                <span>Publica una foto</span>
                <input type="file" className="hidden" name="imagen" onChange={handleImagenSeleccionada}/>
            </label> /*no se podía hacer con un button?*/
        )
    }
}