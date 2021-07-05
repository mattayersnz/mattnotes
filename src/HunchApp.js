import React, { useState } from 'react';
import styled from "@emotion/styled";
import HunchEditor from './components/HunchEditor';
import { useRealmApp } from "./RealmApp";
import useNotes from "./graphql/useNotes";
import { useQuery, useMutation } from "@apollo/client";
import cloneDeep from 'clone-deep';
import omitDeep from 'omit-deep';
// import { useBeforeunload } from 'react-beforeunload';
// import { NewNote } from './Transformations';

const Container = styled.div`
  margin: 20%;
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

  const handleChange = (value) => {
    setValue(value)
  };

  const newNote = () => {
    const graph = omitDeep(cloneDeep(note), ['__typename', '_id'])
    graph.blocks = value
    // console.log("Note saved!", graph)
    updateNote(id, omitDeep(cloneDeep(graph), ['__typename', '_id']));
  }

  const logout = () => {
    //TODO: confirm logout action with user
    app.logOut();
  }


  const saveNote = () => {
    const graph = omitDeep(cloneDeep(note), ['__typename', '_id'])
    graph.blocks = value
    console.log("Note saved!", graph)
    updateNote(id, omitDeep(cloneDeep(graph), ['__typename', '_id']));
  }

  if (loading || !note) {
    if (!loading && !note && !isCreating) { 
      // Create a note if none
      setIsCreating(true);
      (async () => {
        const newNote = await createNote({blocks: initialValue});
        console.log('new note..', newNote)
      })();
      
    }
    return 'loading...';
  }
  if (!loading && note._id != id) {
    setIdValue(note._id);
    handleChange(note.blocks);
  }
  return (
    <Container>
      <HunchEditor value={value} handleChange={handleChange} saveNote={saveNote} logout={logout} />
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