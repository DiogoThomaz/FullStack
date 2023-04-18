import React from 'react';
import styled from 'styled-components';

const SideBarWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #1E7443;
  position: fixed;
  left: 0;
  top: 3em;
  border-right: 1px solid #E5E5E5;
  font-family: 'Roboto', sans-serif;
  color: #FFFFFF;
  
  @media (min-width: 768px) {
    width: 200px;
  }
`;

const Menu = styled.ul`
  list-style: none;
  padding: 1em;
`;

const MenuItem = styled.li`
  padding: 10px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    font-weight: bold;
    font-size: 1.1em;
    color: #FFFFFF;
  }
`;

const SideBar = ({ menuItems, onItemClick }) => {
  return (
    // se largura da tela for menor que 768px, esconde o sidebar
    <SideBarWrapper style={{display: window.innerWidth < 768 ? 'none' : 'block'}}>
      <Menu>
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={() => onItemClick(index)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </SideBarWrapper>
  );
};

export default SideBar; 
