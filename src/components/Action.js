import React from 'react';
import styled from "styled-components";
import enter from '../images/enter.svg';

// Pass in Action Type

export const Action = ({ actionText }) => {
    return (
        <div>
            <ActionBox>
                <Esc>Esc</Esc>
                <ActionContent>
                    <Text>{actionText}</Text>
                </ActionContent>
                  {((actionText === 'Login') || (actionText === 'Reset Password?')) && <Email placeholder="Email"/>}
                  {(actionText === 'Login') && <Password placeholder="Password"/>}
                <Enter src={enter} />
            </ActionBox>
        </div>
    )
}
const ActionBox = styled.div`
position: absolute;
top: 40%;
left: 30%;
/* margin: 24px; */
padding: 22px;
background: #313131;
border-radius: 5px;
width: 30%;
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
`

const ActionContent = styled.span`
padding-left: 14px;
display: flex;
flex-direction: row;
align-self: flex-start;
justify-content: space-between;
`

const Text = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: 2rem;
color: #EBEBEB;
`

const Email = styled.input`
width:90%;
font-size: 1rem;
background: #313131;
margin-left: 14px;
margin-top: 24px;
margin-bottom: 14px;
padding-bottom: 14px;
border: none;
border-bottom: 1px solid #909090;
align-self: flex-start;
outline: none;
`

const Password = styled.input`
width: 90%;
font-size: 1rem;
background: #313131;
margin-left: 14px;
margin-bottom: 24px;
border: none;
border-bottom: 1px solid #909090;
align-self: flex-start;
`

const Enter = styled.img`
display: flex;
flex-direction: column;
align-self: flex-end;
width: 24px;
`

const Esc = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: .7rem;
color: #EBEBEB;
padding-bottom: 7px;
text-align: right;
align-self: flex-end;
`
