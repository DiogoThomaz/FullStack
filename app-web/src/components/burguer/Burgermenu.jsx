import React, { useState } from 'react';
import styles from './burgermenu.module.css';

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles['burger-menu']}>
      <div className={`${styles['menu-button']} ${isOpen ? styles.open : ''}`} onClick={handleMenuClick}>
        <div className={`${styles.bar} ${styles.bar1}`}></div>
        <div className={`${styles.bar} ${styles.bar2}`}></div>
        <div className={`${styles.bar} ${styles.bar3}`}></div>
      </div>
      <ul className={`${styles['menu-links']} ${isOpen ? styles.open : ''}`}>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
  );
}

export default BurgerMenu;
