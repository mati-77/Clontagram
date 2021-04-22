import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Main from '../Componentes/Main';

export default function Login({ login, mostrarError }) {

    const [emailYPassword, setEmailYPassword] = useState({
        email: '',
        password: '',
    });

    function handleInputChange(e) {
        setEmailYPassword({
            ...emailYPassword,
            [e.target.name]: e.target.value
        })
    };

    async function handleSubmit(e) {
        e.preventDefault();/*porque no queremos que haga un refresh de la pagina*/
        try {
            await login(emailYPassword.email, emailYPassword.password)
        } catch(error) {
            mostrarError(error.response.data)
            console.log(error)
        }
        /*dejamos el try catch aca porque el error lo debe manejar el componente
        que corresponde, en este caso, el componente que tiene y envia el formulario */
    }

    return(
        <Main center>
            <div className="FormContainer">
                <h1 className="Form__titulo">Clontagram</h1>
                <div>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            className="Form__field" 
                            required
                            onChange={handleInputChange}
                            value={emailYPassword.email}
                        />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Contraseña" 
                            className="Form__field" 
                            required
                            onChange={handleInputChange}
                            value={emailYPassword.password}
                        />
                        <button type="submit" className="Form__submit">
                            Login
                        </button>
                        <p className="FormContainer__info">
                            No tienes cuenta? <Link to="">Signup</Link>
                        </p>
                    </form>
                </div>
            </div>
        </Main>
    )
}