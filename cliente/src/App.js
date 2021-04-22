import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


import Axios from 'axios';

import { deleteToken, getToken, setToken, initAxiosInterceptors } from './Helpers/auth-helpers';
import Nav from './Componentes/Nav';

import Signup from './Vistas/Signup';
import Login from './Vistas/Login';
import Upload from './Vistas/Upload';
import Feed from './Vistas/Feed';

import Loading from './Componentes/Loading';
import Error from './Componentes/Error'
import Main from './Componentes/Main';



initAxiosInterceptors();/*si hay un token, ese token va a ser parte de la llamada*/

export default function App() {

  const [usuario, setUsuario] = useState(null);/*no sabemos si tenemos usuario autenticado o no*/
  /*queremos aprovechar lo que nos retorna el servidor con handleSubmit */
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarUsuario() {
      if(!getToken()) {
        setCargandoUsuario(false);
        return;
      }

      try {
        const {data: usuario} = await Axios.get('api/usuarios/whoami');
        setUsuario(usuario);
        setCargandoUsuario(false);
      } catch(error) {
        console.log(error);
      }
    }


    cargarUsuario()
  }, [])/*con esto, en caso de ya tener un token, obtenemos el usuario, sin necesidad de que se vuelva a hacer el login*/

  async function login(email, password) {
    const { data } = await Axios.post('api/usuarios/login', { 
      email, 
      password 
    });/*esta llamada retorna dos cosas: data.usuario y data.token*/
    setUsuario(data.usuario) /*actualizamos el estado*/
    setToken(data.token) /*guardamos el token en el localStorage del navegador */
    /*de esta forma, preservamos el token, para que si el usuario refresca la pagina
    o cierra y abre el navegador, el token se encuentra guardado, por lo que podemos
    reestablecer el estado autenticado del usuario */
    /*ahora, debemos pasar esta funcion login al componente Login, como prop*/
  }

  async function signup(usuario) {
    const { data } = await Axios.post('api/usuarios/signup', usuario);
    /*esta llamada retorna dos cosas: data.usuario y data.token*/
    setUsuario(data.usuario) /*actualizamos el estado*/
    setToken(data.token) /*guardamos el token en el localStorage del navegador */
    /*aca hacemos lo mismo para el signup*/
    
  }

  function logout() {
    setUsuario(null);
    deleteToken();
  }
  /*estar logueado implica tener un usuario autenticado, y tener un token, asi que
  con el logout, eliminamos eso*/

  function mostrarError(mensaje) {
    setError(mensaje)
  }

  function esconderError() {
    setError(null)
  }
  

  if(cargandoUsuario) {
    return(
      <Main center>
        <Loading />
      </Main>
    );
  }{/*con esto mostramos la animacion de carga, mientras se renderiza todo*/}

  return(
    <Router>
      <Nav usuario={usuario} />
      <Error mensaje={error} esconderError={esconderError}/>
      {usuario ? (
        <LoginRoutes mostrarError={mostrarError} />
      ) : (
        <LogoutRoutes
          login={login} 
          signup={signup} 
          mostrarError={mostrarError}
        />
      )}
      {/* <div>{ JSON.stringify(usuario) }</div> */}{/*esto es para convertir en string algo que recibimos como objeto y mostrarlo*/}
    </Router>/*envolvemos la app en un Router, y le pasamos el componente con las rutas, con sus respectivos props. */
      
    
  );
}


/*aca empezamos con routing*/

function LoginRoutes({ mostrarError }) {
  return(
    <Switch>
      <Route 
        path="/upload" 
        render={props => <Upload {...props} mostrarError={mostrarError} />}
      />
      <Route 
        path="/"
        render={props => <Feed {...props} mostrarError={mostrarError} />}
        default
      />
    </Switch>
  )
}

function LogoutRoutes({ login, signup, mostrarError }) {
  return(
  <Switch>
    <Route 
      path="/login/" 
      render={props => <Login {...props} login={login} mostrarError={mostrarError} />} /*estos props los inyecta react, y la funcion retorna el componente login.
      Esparcimos las propiedades que react DOM nos envia, y le agregamos cualquier otro prop. Ese/os props los debemos pasar tambien
      como props a LogoutRoutes. y ya tenemos nuestra ruta declarada.*/
    />
    <Route 
      render={props => <Signup {...props} signup={signup} mostrarError={mostrarError} />}
      default /*queremos que sea la ruta por default*/
    />
  </Switch>
  )
}/*rutas cuando no hay un usuario autenticado*/
