/*
conteudo 
*/

import React from 'react';
import { SpanLI } from '../layout';
import styles from './container.module.css';

const CardConteudo = (props) => {
    return (
        <section className={styles.box}>
            <div>
                <SpanLI>{props.titulo}</SpanLI>
            </div>
            <div className={styles.conteudo}>
                {props.children}
            </div>
        </section>
    );
}

export default CardConteudo;