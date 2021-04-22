import React from 'react';
import { Link } from 'react-router-dom';
import stringToColor from 'string-to-color';

export default function Avatar({ usuario }) {
    return (
        <div className="Avatar">
            <ImagenAvatar usuario={usuario} />

            <Link to={`/perfil/${usuario.username}`}>
                <h2>{usuario.username}</h2>
            </Link>
        </div>
    )
}

export function ImagenAvatar({ usuario }) {
    const style = {
        backgroundImage: usuario.imagen ? `url(${usuario.imagen})` : null,
        backgroundColor: stringToColor(usuario.username)
    }/*si el usuario tiene foto de perfil, la usamos. si no, usamos stringToColor para generar un color aleatorio*/

    return (
        <div className="Avatar__img" style={style}></div>
        /*le pasamos los estilos que creamos arriba*/
    )
}