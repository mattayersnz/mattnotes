import React from "react";
import styled from "@emotion/styled";
import HunchEditor from './components/HunchEditor';

// import { useRealmApp } from "./RealmApp";

export default function HunchApp() {
  // const app = useRealmApp();
  // const currentLoggedInUser = app.currentUser.customData;
  
  return (
    <Container>
      <HunchEditor />
    </Container>
  );
}

const sidebarWidth = "420px";
const Container = styled.div`
  box-sizing: border-box;
  height: 100vh;
  width: 100vh;
  display: grid;
  grid-template-columns: ${sidebarWidth} calc(100vw - ${sidebarWidth});
  grid-template-rows: 1fr;
  grid-template-areas: "sidebar main";
`;
