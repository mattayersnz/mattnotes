import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";
import HunchEditor from './components/HunchEditor';
import { useRealmApp } from "./RealmApp";
import useNotes from "./graphql/useNotes";
import useUsers from "./graphql/useUsers";
import useAllNotes from './graphql/useNotesAll';
import useNotesLinked from './graphql/useNotesLinked';
import { Action } from './components/Action';
import { ObjectId } from "bson";
import {
  convertNoteToSaveFormat,
  createNewNoteBlocks,
  createInitialNoteBlocks,
  getLinkedNoteIdsFromNote
} from './scripts/noteHelpers';
import ListView from './components/ListView';
import Loading from './components/Loading';

const Container = styled.div`
  margin: 25%;
  margin-top: 12%;
`;

export default function HunchApp() {
  const app = useRealmApp();
  const currentLoggedInUser = app.currentUser;
  const currentUser = { id: currentLoggedInUser._id };
  const activeNoteId = currentLoggedInUser.customData.lastActiveNoteId ? currentLoggedInUser.customData.lastActiveNoteId.$oid : null;


  const [loadId, setLoadId] = useState(null);

  useEffect(() => {
    !loadId && activeNoteId && setLoadId(activeNoteId)
  }, [activeNoteId, loadId]);

  const [linkedNoteIds, setLinkedNoteIds] = useState([]);
  const [id, setIdValue] = useState(null);
  const { note, createNote, updateNote, deleteNote, loading } = useNotes(currentUser, loadId);
  const { updateUser } = useUsers(currentUser);

  const [isCreating, setIsCreating] = useState(false);
  const [value, setValue] = useState();
  const [isAction, setIsAction] = useState(false);

  const [actionType, setActionType] = useState(false);

  const { notes } = useAllNotes(currentUser);
  const { loadingMeta, notesMeta } = useNotesLinked(currentUser, linkedNoteIds)
  const handleChange = (updatedValue) => {
    setValue(updatedValue)
  };

  //logout actions
  const logoutStart = () => {
    setIsAction(true);
    setActionType('logout');
  }

  const actionEnd = () => {
    setIsAction(false);
  }

  //List View
  const [isListView, setIsListView] = useState(false)

  const deleteNoteStart = () => {
    setIsAction(true);
    setActionType('delete');
  }

  const deleteNoteFn = () => {
    deleteNote(id);
    setLoadId(null);
    actionEnd();
  }

  const saveNote = () => {
    updateNote(id, convertNoteToSaveFormat(note, value));
  }

  const newNote = (selectedText) => {
    const newId = new ObjectId();
    createNote(newId, createNewNoteBlocks(id, selectedText));
    setLinkedNoteIds([...linkedNoteIds, newId.toString()])
    return newId.toString();
  }

  const GetNote = async (linkedNoteId) => {
    //set users new last active note id
    updateUser({ lastActiveNoteId: linkedNoteId });
    // save current note before loading a new one
    saveNote();
    setLoadId(linkedNoteId);
    window.scrollTo(0, 0);
  };

  if (loading || !note) {
    if (loadId && !loading && !note) {
      setLoadId(null);
    } else if (!loading && !note && !isCreating && !loadId) {
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
    setLinkedNoteIds(getLinkedNoteIdsFromNote(note.blocks));
  }

  return (
    <Container>
      <HunchEditor
        value={value}
        notesMeta={notesMeta}
        handleChange={handleChange}
        saveNote={saveNote}
        newNote={newNote}
        getNote={GetNote}
        deleteNote={deleteNoteStart}
        logout={logoutStart}
        isAction={isAction}
        isListView={isListView}
        setIsListView={setIsListView}
        isMetaDataLoading={loadingMeta}
      />
      { isAction && <Action 
        actionType={actionType} 
        eventAction={actionType === 'logout' ? app.logOut : deleteNoteFn} 
        eventCancel={actionEnd}
      /> }
      { isListView && <ListView list={notes} getNote={GetNote} setIsListView={setIsListView}/> }
    </Container>
  );
}
