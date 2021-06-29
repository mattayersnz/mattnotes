import React, { useState } from 'react';
import styled from "@emotion/styled";
import HunchEditor from './components/HunchEditor';
// import { useRealmApp } from "./RealmApp";

const Container = styled.div`
  margin: 20%;
  margin-top: 10%;
`;

export default function HunchApp() {
  const [value, setValue] = useState(initialValue);
  const [id, setIdValue] = useState(null);

  const handleChange = (value) => {
    setValue(value)
    setIdValue(id)
  };
  // const app = useRealmApp();
  // const currentLoggedInUser = app.currentUser.customData;

  //get inital note or create one
  
  return (
    <Container>
      <HunchEditor value={value} handleChange={handleChange} />
    </Container>
  );
}



const initialValue = [
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
]