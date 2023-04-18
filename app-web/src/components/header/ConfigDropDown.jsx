import React, { useState } from "react";
import "./styles.css";

const ConfigMenu = () => {
  return (
    <div style={{  }}>
      <ul>
        <li>Opção 1</li>
        <li>Opção 2</li>
        <li>Opção 3</li>
      </ul>
    </div>
  );
};

const ConfigDropDown = () => {
  const [showConfigMenu, setShowConfigMenu] = useState(false);

  const toggleConfigMenu = () => {
    setShowConfigMenu(!showConfigMenu);
  };

  return (
    <div>
      <button onClick={toggleConfigMenu}>Configurações</button>
      {showConfigMenu ? <ConfigMenu /> : null}
    </div>
  );
};

export default ConfigDropDown;
