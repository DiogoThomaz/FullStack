import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { Box } from '@mui/material';

// icone do input search é verde
const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #F0F0F0;
  border-radius: 2em;
  padding-left: 1em;
    padding-right: 1em;
      

`;

const Input = styled.input`
  border: none;
  outline: none;
  margin-left: 0.5rem;
  font-size: 1em;
  border-radius: 2em;
  background-color: #F0F0F0;
  background-image: url(${FaSearch});
  background-repeat: no-repeat;
  background-position: 10px 10px;
  background-size: 20px 20px;
  color: #1E7443;
    
`;

const SearchIcon = styled(FaSearch)`
  font-size: 1.2em;
  color: #1E7443;
`;


const SearchBox = ({ value, onChange }) => {
  return (
    <Box sx={{display: { xs: 'none', sm: 'none', md: 'flex'} }}>
    <SearchBoxWrapper>
      <SearchIcon />
      <Input type="text" value={value} onChange={onChange} placeholder="Pesquisar" />
    </SearchBoxWrapper>
    </Box>
  );
};

export default SearchBox;
