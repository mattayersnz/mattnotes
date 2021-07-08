import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const getNotes = (project, noteId) => {
  const { note, loading } = useGetNote(project, noteId);
  return {
    loading,
    note
  };
};
export default getNotes;

const useGetNote = (project, noteId) => {
    console.log('note', noteId)
    const { data, loading, error } = useQuery(
    gql`
    query GetNoteForUser($noteId: String!, $partition: String!) {
      note(query: { _id: $noteId, _partition: $partition}) {
        _id
        blocks {
          type
          children {
            text
            type
            bold
            italic
            underline
            linkNoteId
          }
        }
      }
    }
    `,
    { variables: { noteId: noteId, partition: `note=${project.id}`} }
  );
  if (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }
  // If the query has finished, return the notes from the result data
  // Otherwise, return an empty list
  const note = data?.note;
  return { note, loading };
}