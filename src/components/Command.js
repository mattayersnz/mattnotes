import React from 'react';
import styled from "styled-components";
import { Colours } from '../globalstyles/Colours';


export const Command = () => {

  const shortcuts = [
    { "id": 1, "title": "View Notes", "shortcut": " ⌘G" },
    { "id": 2, "title": "Create Link", "shortcut": " ⌘L" },
    { "id": 3, "title": "Navigate to Link", "shortcut": " ⌘Y" },
    { "id": 4, "title": "Toggle Property Block", "shortcut": " ⌘2" },
    { "id": 5, "title": "Toggle Star Block", "shortcut": " ⌘3" },
    { "id": 6, "title": "Toggle Question Block", "shortcut": " ⌘4" },
    { "id": 7, "title": "Logout", "shortcut": " ⌘Esc" }
  ]

    return (
        <div>
          <View>
            <CommandBox>
              <CommandTitle>
                Hunch Commands
              </CommandTitle>
              {shortcuts.map((item) => (
                <CommandItem
                  key={item.id}
                  item={item.title}
                >
                {item.title}
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandBox>
          </View>
        </div>
    )
}

const View = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  overflow: auto;
  width: 100%;
  height: 100vh;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CommandBox = styled.div`
  position: fixed;
  padding: 24px;
  border-radius: 5px;
  background: #292929;
  opacity: 10;
  display: flex;
  flex-direction: column;
  width: 50vw;
`

const CommandTitle = styled.span`
font-family: 'Rubik', 'sans serif';
font-style: normal;
line-height: 12px;
font-size: 10px;
font-weight: 300;
letter-spacing: 0.2em;
text-transform: uppercase;
color: #707070;
`

const CommandShortcut = styled.span`
font-family: 'Rubik', 'sans serif';
font-style: normal;
line-height: 26px;
font-size: 14px;
font-weight: 300;
color: #707070;
`

const CommandItem = styled.span`
font-family: 'Rubik', 'sans serif';
font-style: normal;
font-size: 14px;
font-weight: normal;
line-height: 26px;
color: ${Colours.font.light};
padding-top: 4px;
`
