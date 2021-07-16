import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Colours } from '../globalstyles/Colours';

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

const ListItem = ({ item, active, goToNewNote, setHovered }) => (
  <div
    className={`item ${active ? "active" : ""}`}
    onClick={() => goToNewNote(item)}
    onMouseEnter={() => setHovered(item)}
    onMouseLeave={() => setHovered(undefined)}
  >
    {item.title}
  </div>
);

const ListView = ({ list, getNote, setIsListView }) => {
  const items = list.filter(function (item) {
    return item.title;
  });
  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);


  const goToNewNote = useCallback((item) => {
    setSelected(item);
    item && getNote(item._id);
    setIsListView(false)
  }, [setIsListView, getNote]);
  // const goToNewNote = (item) => {
    
  // }

  useEffect(() => {
    if (items.length && downPress) {
      setCursor(prevState =>
        prevState < items.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress, items.length]);
  useEffect(() => {
    if (items.length && upPress) {
      setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress, items.length]);
  useEffect(() => {
    if (items.length && enterPress) {
      goToNewNote(items[cursor])
    }
  }, [cursor, enterPress, goToNewNote, items]);
  useEffect(() => {
    if (items.length && hovered) {
      setCursor(items.indexOf(hovered));
    }
  }, [hovered, items]);

  return (
    <View>
      <Esc> Esc </Esc>
      <span>Selected: {selected ? selected.title : "none"}</span>
      {items.map((item, i) => (
        <ListItem
          key={item._id}
          active={i === cursor}
          item={item}
          goToNewNote={goToNewNote}
          setHovered={setHovered}
        />
      ))}
    </View>
  );
};

const View = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  background: #313131;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  opacity: 0.97;
  font-family: 'Rubik', 'sans serif';
  font-size: 3rem;
  font-weight: 600;
  color: ${Colours.font.dark};;
  .item.active,
  .item:hover {
    color: ${Colours.font.light};
}

.item:hover {
  cursor: pointer;
}
`

const Esc = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: .9rem;
color: ${Colours.font.light};
margin: 24px;
text-align: right;
align-self: flex-end;
`

export default ListView