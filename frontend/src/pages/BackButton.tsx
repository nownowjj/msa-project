import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <BackBtn onClick={()=> {navigate(-1)}}>
            ◀
        </BackBtn>
    );
};

export default BackButton;

const BackBtn = styled.button`
    position: absolute;
    border: none;
    background: none;
    font-size: 22px;
    font-weight: bold;
    left: 15px;
    top: 15px;
`