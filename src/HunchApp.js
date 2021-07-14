import React, { useState } from 'react';
import styled from "@emotion/styled";
import HunchEditor from './components/HunchEditor';
import { useRealmApp } from "./RealmApp";
import useNotes from "./graphql/useNotes";
import useUsers from "./graphql/useUsers";
import cloneDeep from 'clone-deep';
import omitDeep from 'omit-deep';
import { Action } from './components/Action';
import { ObjectId } from "bson";
import { createNewNoteBlocks, createInitialNoteBlocks } from './scripts/noteHelpers';
import ListView from './components/ListView';
import {listenerEnter} from './scripts/keyboardHelpers';
import Loading from './components/Loading';

const Container = styled.div`
  margin: 25%;
  margin-top: 12%;
`;

export default function HunchApp({ isLoading }) {
  console.log('isLoading', isLoading)
  const app = useRealmApp();
  const currentLoggedInUser = app.currentUser;
  const currentUser = { id: currentLoggedInUser._id };
  const activeNoteId = currentLoggedInUser.customData.lastActiveNoteId ? currentLoggedInUser.customData.lastActiveNoteId.$oid : null;

  const [loadId, setLoadId] = useState(activeNoteId);
  const [id, setIdValue] = useState(null);
  const { note, createNote, updateNote, loading } = useNotes(currentUser, loadId);
  const { updateUser } = useUsers(currentUser);

  const [isCreating, setIsCreating] = useState(false);
  const [value, setValue] = useState();
  const [isAction, setIsAction] = useState(false);

  const handleChange = (updatedValue) => {
    setValue(updatedValue)
  };

  //logout actions
  const logoutStart = () => {
    setIsAction(true);
    listenerEnter(true, app.logOut, logoutEnd);
  }

  const logoutEnd = () => {
    setIsAction(false);
  }

  //List View
  const [isListView, setIsListView] = useState(false)

  const saveNote = () => {
    const graph = omitDeep(cloneDeep(note), ['__typename', '_id'])
    graph.blocks = value;
    updateNote(id, omitDeep(cloneDeep(graph), ['__typename', '_id']));
  }

  const newNote = (selectedText) => {
    const newId = new ObjectId();
    createNote(newId, createNewNoteBlocks(id, selectedText))
    return newId.toString();
  }

  const GetNote = async (linkedNoteId) => {
    // save current note before loading a new one
    saveNote();
    setLoadId(linkedNoteId);
    //set users new last active note id
    updateUser({ lastActiveNoteId: linkedNoteId });
    window.scrollTo(0, 0);

  };

  if (loading || !note) {
    if (!loading && !note && !isCreating) {
      // Create a note if none
      setIsCreating(true);
      (async () => {
        const newId = new ObjectId();
        await createNote(newId, createInitialNoteBlocks());
      })();

    }
    return <Loading stage={2} />;
  }

  if (!loading && (!value || note._id !== id)) {
    setIdValue(note._id);
    handleChange(note.blocks);
  }

  return (
    <Container>
      <HunchEditor
        value={value}
        handleChange={handleChange}
        saveNote={saveNote}
        newNote={newNote}
        getNote={GetNote}
        logout={logoutStart}
        isAction={isAction}
        isListView={isListView}
        setIsListView={setIsListView}
      />
      { isAction && <Action actionText={"Logout?"} /> }
      { isListView && <ListView value={value} /> }
    </Container>
  );
}
