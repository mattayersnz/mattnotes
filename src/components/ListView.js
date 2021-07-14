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

// const items = [
//   { id: 1, title: "Founder Chats" },
//   { id: 2, title: "Hunch Strategy" },
//   { id: 3, title: "Note Apps" },
//   { id: 4, title: "Notion" },
//   { id: 5, title: "Obsidian" }
// ];

const ListItem = ({ item, active, setSelected, setHovered }) => {

  return (
    <div
      className={`item ${active ? "active" : ""}`}
      onClick={() => setSelected(item)}
      onMouseEnter={() => setHovered(item)}
      onMouseLeave={() => setHovered(undefined)}
    >
      {item}
    </div>
  )
};

const ListView = (props) => {
  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);

  // Get notes
  const notes = props.value
  const noteTitles = notes.filter(getTitles)
  function getTitles(notes) {
    return notes.type === 'title';
  }
  console.log(noteTitles)

  useEffect(() => {
    if (noteTitles.length && downPress) {
      setCursor(prevState =>
        prevState < noteTitles.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress, noteTitles]);
  useEffect(() => {
    if (noteTitles.length && upPress) {
      setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress, noteTitles]);
  useEffect(() => {
    if (noteTitles.length && enterPress) {
      setSelected(noteTitles[cursor]);
    }
  }, [cursor, enterPress, noteTitles]);
  useEffect(() => {
    if (noteTitles.length && hovered) {
      setCursor(noteTitles.indexOf(hovered));
    }
  }, [hovered, noteTitles]);

  console.log("Selected", selected)

  return (
    <View>
      <Esc> Esc </Esc>
      <span>Selected: {selected ? selected.children[0].text : "none"}</span>
      {noteTitles.map((title, i) => (
        <ListItem
          key={noteTitles.indexOf(title)}
          active={i === cursor}
          item={title.children[0].text}
          setSelected={setSelected}
          setHovered={setHovered}
        />
      ))}
    </View>
  );
};

const View = styled.div`
  position: fixed;
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
