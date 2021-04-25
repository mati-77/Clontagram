import React, { useState } from 'react';

export default function Comentar({ onSubmitComentario, mostrarError }) {
    const [mensaje, setMensaje] = useState('');
    const [enviandoComentario, setEnviandoComentario] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();

        if (enviandoComentario) {
            return;
        }

        try {
            setEnviandoComentario(true)
            await onSubmitComentario(mensaje)/*recordar que mensaje es lo que se escribe en el input, y se encuntra guardado en un estado*/
            setMensaje('')/*reseteamos el input*/
            setEnviandoComentario(false)
        } catch (error) {
            setEnviandoComentario(false)
            mostrarError('Hubo un problema guardando el comentario. Intenta de nuevo')
        }
    }
    
    return (
        <form className="Post__comentario-form-container" onSubmit={onSubmit}>
            <input 
                type="text" 
                placeholder="Deja un comentario..." 
                required 
                maxLength="180"
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
            />
            <button type="submit">Post</button>
        </form>
    )
}