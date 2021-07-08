import React, { useState } from 'react';
import styled from "@emotion/styled";
import HunchEditor from './components/HunchEditor';
import { useRealmApp } from "./RealmApp";
import useNotes from "./graphql/useNotes";
// import getNotes from "./graphql/getNotes";
import cloneDeep from 'clone-deep';
import omitDeep from 'omit-deep';
import { Action } from './components/Action';
import { ObjectId } from "bson";

// import { useBeforeunload } from 'react-beforeunload';
// import { NewNote } from './Transformations';

import {listenerEnter} from './keyboardHelper';

const Container = styled.div`
  margin: 20%;
  margin-top: 10%;
`;

export default function HunchApp() {
  const app = useRealmApp();
  const currentLoggedInUser = app.currentUser;
  const currentUser = { id: currentLoggedInUser._id, lastNoteId: '60e03f562ee565315434ab90' };

  const [id, setIdValue] = useState('60e03f562ee565315434ab90');
  const { note, createNote, updateNote, loading } = useNotes(currentUser, id);

  const [isCreating, setIsCreating] = useState(false);
  const [value, setValue] = useState();
  const [isAction, setIsAction] = useState(false);

  const handleChange = (updatedValue) => {
    console.log('value', updatedValue);
    setValue(updatedValue)
  };

  //logout actions
  const logoutStart = () => {
    setIsAction(true);
    listenerEnter(isAction, app.logOut())
  }

  const saveNote = () => {
    const graph = omitDeep(cloneDeep(note), ['__typename', '_id'])
    graph.blocks = value;
    updateNote(id, omitDeep(cloneDeep(graph), ['__typename', '_id']));
  }

  const newNote = () => {
    const newId = new ObjectId();
    createNote(newId, {blocks: [
      {
        type: 'title',
        children: [{ text: 'new note' }],
      }
    ]})
    return newId.toString();
  }

  const GetNote = async (linkedNoteId) => {
    // let { note, loading } = getNotes(currentUser, linkedNoteId);
    setIdValue(linkedNoteId);
    // handleChange(note.blocks);
  };

  if (loading || !note) {
    if (!loading && !note && !isCreating) {
      // Create a note if none
      setIsCreating(true);
      (async () => {
        const newId = new ObjectId();
        console.log('create note');
        await createNote(newId, {blocks: initialValue});
      })();

    }
    return 'loading...';
  }
  if (!loading && (!value || note._id !== id)) {

    console.log('note', note)
    setIdValue(note._id);
    handleChange(note.blocks);
  }

  return (
    <Container>
      <HunchEditor value={value} handleChange={handleChange} saveNote={saveNote} newNote={newNote} getNote={GetNote} logout={logoutStart} isAction={isAction} />
      { isAction && <Action actionText={"Logout?"} /> }
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
