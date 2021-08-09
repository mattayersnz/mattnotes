import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import styled from "styled-components";
import { Colours } from '../globalstyles/Colours';


export const NoteSuggest = ({
      list,
      getNote,
      newNote,
      isSuggesting,
      setIsSuggesting,
      cursorPosition,
      isTyping,
      setIsTyping,
      createNote,
      createNewNoteBlocks,
      id,
      setLinkedNoteIds,
      linkedNoteIds,
      saveNote,
      setLoadId,
      updateUser,
      isError,
      setIsError
    }) => {

    const items = list.filter(function (item) {
      return item
    });

    const useKeyPress = function(targetKey) {
      const [keyPressed, setKeyPressed] = useState(false);

      function downHandler({ key }) {
        if (key === targetKey) {
          setKeyPressed(true);
        }
      }

      const upHandler = ({ key }) => {
        if (key === targetKey) {
          setKeyPressed(false);
        }
      };

      React.useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        return () => {
          window.removeEventListener("keydown", downHandler);
          window.removeEventListener("keyup", upHandler);
        };
      });

      return keyPressed;
    };

    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const enterPress = useKeyPress("Enter");
    const nPress = useKeyPress("n");
    const escapePress = useKeyPress("Escape");
    const [cursor, setCursor] = useState(0);
    const [textInput, setTextInput] = useState("");

    // Access text input
    const inputRef = useRef();
    useEffect(() => {
      if (isTyping && textInput === '') {
        inputRef.current.focus();
      }
    }, [isTyping, textInput]);

    // Down Arrow
    useEffect(() => {
      if (items.length && downPress) {
        setCursor(prevState =>
          prevState < items.length - 1 ? prevState + 1 : prevState
        );
      }
    }, [downPress, items.length]);

    // Up Arrow
    useEffect(() => {
      if (items.length && upPress) {
        setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
      }
    }, [upPress, items.length]);

    // New Note Typing
    useEffect(() => {
      if (items.length && nPress) {
        setIsTyping(true);
      }
    }, [nPress, items.length, setIsTyping]);

    // Enter
    useEffect(() => {
      if (items.length && enterPress) {
        try {
          items[cursor] && getNote(items[cursor]._id);
          setIsSuggesting(false)
          setIsTyping(false)
        } catch {
          setIsError(true);
        }
      }

      if (items.length && enterPress && isTyping) {
        try {
          newNote(textInput);
          setIsTyping(false);
          setIsSuggesting(false);
        } catch {
          setIsError(true);
        }
      }
    }, [cursor, enterPress, items, getNote, setIsSuggesting, isTyping, newNote, setIsError, setIsTyping, textInput]);

    // Escape
    useEffect(() => {
      if (items.length && escapePress) {
        setIsTyping(false);
        setIsSuggesting(false);
      }
    }, [escapePress, items.length, setIsTyping, setIsSuggesting]);

    return ReactDOM.createPortal(
        <NoteSuggestBox className="NoteSuggestBox" position={cursorPosition}>
            { !isTyping && items[cursor].title }
            { isTyping && <Typing
                              ref={inputRef}
                              type="text"
                              input={textInput}
                              onChange={e => setTextInput(e.target.value)}
                              /> }
        </NoteSuggestBox>,
        document.body
    )
};

const NoteSuggestBox = styled.span`
  padding: 4px 4px 2px 4px;
  position: absolute;
  top: ${({ position }) =>
    position ? position.top + window.pageYOffset + 4 : -100}px;
  left: ${({ position }) =>
    position ? position.left + window.pageXOffset - 10 : -100}px;
  z-index: 100;
  margin-top: -0.5rem;
  opacity: 0.9;
  font-family: 'Rubik', 'sans serif';
  font-size: 1rem;
  background-color: ${Colours.font.light};
  color: ${Colours.font.dark};
  border-radius: 2px;
`;

const Typing = styled.input`
  font-family: 'Rubik', 'sans serif';
  font-size: 1rem;
  margin-top: -0.5rem;
  background-color: ${Colours.font.light};
  color: ${Colours.font.dark};
  border: none;
  outline: none;
  caret-color: ${Colours.font.dark};
`;
