import React, { useState } from 'react';

export default function Comentar({ onSubmitComentario, mostrarError }) {
    const [mensaje, setMensaje] = useState('');

    async function onSubmit(e) {
        e.preventDefault();
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