import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Main from '../Componentes/Main';
import imagenSignup from '../imagenes/signup.png';


export default function Signup({ signup, mostrarError }) {

    const [usuario, setUsuario] = useState({
        email: '',
        username: '',
        password: '',
        bio: '',
        nombre: '',
    });


    function handleInputChange(e) {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        })
    };

    async function handleSubmit(e) {
        e.preventDefault();/*porque no queremos que haga un refresh de la pagina*/
        try {
            await signup(usuario);
            /* const { data } = await Axios.post('api/usuarios/signup', usuario); */
            /*por Axios, la informacion que nos devuelve el servidor nos llega en forma de objeto. Y ese objeto tiene una propiedad data, que es la que
            nos interesa. Entonces, la destructuramos */
            /*estamos haciendo una llamada de tipo post */
        } catch(error) {
            mostrarError(error.response.data)
            console.log(error);
        }
    }
    return(
        <Main center={true}>
            <div className="Signup">
                <img src={imagenSignup} alt="" className="Signup__img"/>
                <div className="FormContainer">
                    <h1 className="Form__titulo">Clontagram</h1>
                    <p className="FormContainer__info">
                        Registrate para que veas el clon de instagram
                    </p>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            className="Form__field" 
                            required
                            onChange={handleInputChange}
                            value={usuario.email}
                        />
                        <input 
                            type="text" 
                            name="nombre" 
                            placeholder="Nombre y Apellido" 
                            className="Form__field" 
                            required
                            minLength="3"
                            maxLength="100"
                            onChange={handleInputChange}
                        />
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Username" 
                            className="Form__field" 
                            required
                            minLength="3"
                            maxLength="30"
                            onChange={handleInputChange}
                        />
                        <input 
                            type="text" 
                            name="bio" 
                            placeholder="Cuentanos de ti..." 
                            className="Form__field" 
                            required
                            maxLength="150"
                            onChange={handleInputChange}
                        />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Contraseña" 
                            className="Form__field" 
                            required
                            onChange={handleInputChange}
                        />
                        <button className="Form__submit" type="submit">Sign Up</button>
                        <p className="FormContainer__info">
                            Ya tienes una cuenta? <Link to="/login">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </Main>
    )
}