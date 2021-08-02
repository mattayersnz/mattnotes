import React from 'react';
import styled from "styled-components";
import enter from '../images/enter.svg';
import { Colours } from '../globalstyles/Colours';

export const Action = ({ children, actionType, hideEscape, onEnterClick }) => {
    return (
        <div>
            <ActionBox>
                {!hideEscape && <Esc>Esc</Esc>}
                <ActionContent>
                    <Text>{actionType === 'register' ? 'Sign up' : 'Login' }</Text>
                </ActionContent>
                <ActionContent>
                    {children}
                </ActionContent>
                
                <Enter onClick={onEnterClick} src={enter} />
            </ActionBox>
        </div>
    )
}


const ActionBox = styled.div`
padding: 24px;
background: #313131;
border-radius: 5px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
align-self: center;
width: 40vw;
@media only screen and (max-width: 600px) {
  width: 80vw;
}
`

const ActionContent = styled.span`
padding-left: 12px;
padding-top: 12px;
display: flex;
flex-direction: row;
align-self: flex-start;
justify-content: space-between;
width: 100%;
`

const Text = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: 2rem;
font-weight: bold;
color: ${Colours.font.light}
`

const Enter = styled.img`
display: flex;
flex-direction: column;
align-self: flex-end;
width: 32px;
`

const Esc = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: .9rem;
color: ${Colours.font.light}
padding-bottom: 7px;
text-align: right;
align-self: flex-end;
`
