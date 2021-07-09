import React from 'react';
import styled from "styled-components";


const ListView = (prop) => {

  const titles = [
    {title: "Founder Chats"},
    {title: "Hunch Strategy"},
    {title: "Note Apps"},
    {title: "Notion"},
    {title: "Obsidian"},
  ]

  return (
    <View>
    <Esc> Esc </Esc>
    {
      titles.map((item) => (
        <Text key={item.title}> {item.title} </Text>
      ))
    }
    </View>
  )
}

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
`
const Text = styled.div`
  font-family: 'Rubik', 'sans serif';
  font-size: 3rem;
  font-weight: 600;
  color: #EBEBEB;
  margin-bottom: 14px;
`

const Esc = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: .9rem;
color: #EBEBEB;
margin: 24px;
text-align: right;
align-self: flex-end;
`

export default ListView
