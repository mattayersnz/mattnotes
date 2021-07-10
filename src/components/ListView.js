import React, { useState, useEffect } from "react";
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

const items = [
  { id: 1, title: "Founder Chats" },
  { id: 2, title: "Hunch Strategy" },
  { id: 3, title: "Note Apps" },
  { id: 4, title: "Notion" },
  { id: 5, title: "Obsidian" }
];

const ListItem = ({ item, active, setSelected, setHovered }) => (
  <div
    className={`item ${active ? "active" : ""}`}
    onClick={() => setSelected(item)}
    onMouseEnter={() => setHovered(item)}
    onMouseLeave={() => setHovered(undefined)}
  >
    {item.title}
  </div>
);

const ListView = () => {
  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);

  useEffect(() => {
    if (items.length && downPress) {
      setCursor(prevState =>
        prevState < items.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);
  useEffect(() => {
    if (items.length && upPress) {
      setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);
  useEffect(() => {
    if (items.length && enterPress) {
      setSelected(items[cursor]);
    }
  }, [cursor, enterPress]);
  useEffect(() => {
    if (items.length && hovered) {
      setCursor(items.indexOf(hovered));
    }
  }, [hovered]);

  return (
    <View>
      <Esc> Esc </Esc>
      <span>Selected: {selected ? selected.title : "none"}</span>
      {items.map((item, i) => (
        <ListItem
          key={item.id}
          active={i === cursor}
          item={item}
          setSelected={setSelected}
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
  opacity: 0.95;
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
