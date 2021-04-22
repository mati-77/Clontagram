import React from 'react';

export default function Main({ children, center }) {
    let classes = `Main ${center ? 'Main--center' : ''}`
    /*estas son las clases que le vamos a aplicar a Main*/
    /*siempre queremos que esté la clase main, y dependiendo del prop center, tendremos o no una clase opcional*/
    /*si center es true, aplicamos una clase extra */

    return(
        <main className={classes}>{children}</main>
        /*todos los componentes reciben childrens*/
        /*los children son los componentes que se encuentran envueltos por otro componente o por un elemento (un div por ejemplo)*/
        /*lo que este envuelto en Main, llega como children, y termina en donde indicamos. Lo envolvemos y lo retornamos*/
    )
}