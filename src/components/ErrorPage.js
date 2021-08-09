import React from "react";
import styled from "styled-components";
import { Colours } from "../globalstyles/Colours";

export default function ErrorPage() {

  return (
    <Container>
      <ErrorText>Oops, that didn't work...</ErrorText>
    </Container>
  )

}

const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  background: #313131;
  overflow: auto;
  width: 100%;
  height: 100vh;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.97;
  font-family: 'Rubik', 'sans serif';
  font-size: 3rem;
  font-weight: 600;
  padding-bottom: 32px;
`;

const ErrorText = styled.div`
  color: ${Colours.font.light};
  font-size: 50px;
`;
