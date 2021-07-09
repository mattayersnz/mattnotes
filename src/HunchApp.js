import React, { useState } from 'react';
import styled from "@emotion/styled";
import HunchEditor from './components/HunchEditor';
import { useRealmApp } from "./RealmApp";
import useNotes from "./graphql/useNotes";
import cloneDeep from 'clone-deep';
import omitDeep from 'omit-deep';
import { Action } from './components/Action';
import ListView from './components/ListView';
// import { useBeforeunload } from 'react-beforeunload';
// import { NewNote } from './Transformations';

import {listenerEnter} from './keyboardHelper';

const Container = styled.div`
  margin: 25%;
  margin-top: 10%;
`;

export default function HunchApp() {
  const app = useRealmApp();
  const currentLoggedInUser = app.currentUser;
  const currentUser = { id: currentLoggedInUser._id };
  const { note, createNote, updateNote, loading } = useNotes(currentUser);

  const [isCreating, setIsCreating] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [id, setIdValue] = useState(null);
  const [isAction, setIsAction] = useState(false);

  const handleChange = (value) => {
    setValue(value)
  };


  //logout actions
  const logoutStart = () => {
    setIsAction(true);
    listenerEnter(isAction, app.logOut())
  }

  //List View
  const [isListView, setIsListView] = useState(false)

  const saveNote = () => {
    const graph = omitDeep(cloneDeep(note), ['__typename', '_id'])
    graph.blocks = value
    updateNote(id, omitDeep(cloneDeep(graph), ['__typename', '_id']));
  }

  if (loading || !note) {
    if (!loading && !note && !isCreating) {
      // Create a note if none
      setIsCreating(true);
      (async () => {
        await createNote({blocks: initialValue});
      })();

    }
    return 'loading...';
  }

  if (!loading && note._id !== id) {
    setIdValue(note._id);
    handleChange(note.blocks);
  }

  return (
    <Container>
      <HunchEditor
        value={value}
        handleChange={handleChange}
        saveNote={saveNote}
        logout={logoutStart}
        isAction={isAction}
        isListView={isListView}
        setIsListView={setIsListView}
      />
      { isAction && <Action actionText={"Logout?"} /> }
      { isListView && <ListView /> }
    </Container>
  );
}

const initialValue = [
  {
    type: 'title',
    children: [{ text: 'Thoughts...' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'go here' }],
  }
]
