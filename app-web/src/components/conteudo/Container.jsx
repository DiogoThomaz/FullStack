/*
conteudo 
*/

import React from 'react';
import styles from './container.module.css';

const Container = (props) => {
    return (
        <section className={styles.box}>
            <div>
                <h3>{props.titulo}</h3>
                <hr />
            </div>
            <div className={styles.conteudo}>
                {props.children}
            </div>
        </section>
    );
}

export default Container;