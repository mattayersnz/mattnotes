import React from "react";
import styled from "styled-components";
import { Colours } from "../globalstyles/Colours";

export default function Loading({ stage }) {

  return (
    <Container>
      <LoadingText>{stage === 1 ? '.' : '...' }</LoadingText>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  background: ${Colours.background}
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const LoadingText = styled.div`
  color: ${Colours.font.light};
  font-size: 50px;
`;