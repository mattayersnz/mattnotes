import React, { useEffect, useCallback } from 'react';
import styled from "styled-components";
import enter from '../images/enter.svg';

export const Action = ({ actionType, children, hideEscape, onEnterClick, eventAction, eventCancel }) => {

    const handleEventCancel = eventCancel;
    const handleEventAction = eventAction;

    const keyDownHandler = useCallback((event) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            handleEventAction();
        }
        else if (event.keyCode === 27) {
            handleEventCancel();
        }
    }, [handleEventCancel, handleEventAction])
    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler);
        return () => {
            window.removeEventListener("keydown", keyDownHandler);
        };
    }, [keyDownHandler]);

    const getActionText = (actionType) => {
        switch(actionType) {
            case 'login': 
                return 'Login';
            case 'logout': 
                return 'Logout';
            case 'delete': 
                return 'Delete Note?';
            default: 
                return 'Login';
        }
    }

    return (
        <div>
            <ActionBox>
                {!hideEscape && <Esc>Esc</Esc>}
                <ActionContent>
                    <Text>{getActionText(actionType)}</Text>
                </ActionContent>
                {actionType === 'login' &&
                    <ActionContent>
                        {children}
                    </ActionContent>
                }
                <Enter onClick={onEnterClick} src={enter} />
            </ActionBox>
        </div>
    )
}
const ActionBox = styled.div`
position: absolute;
top: 40%;
left: 30%;
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
width: 100%;
`

const Text = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: 1.7rem;
color: #EBEBEB;
`

const Enter = styled.img`
display: flex;
flex-direction: column;
align-self: flex-end;
width: 24px;
`

const Esc = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: .9rem;
color: #EBEBEB;
padding-bottom: 7px;
text-align: right;
align-self: flex-end;
`
