import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const useNotesLinked = (project, noteIds) => {
    const { notes, loading } = useGetNoteMeta(project, noteIds);
    return {
      loading,
      notesMeta: notes
    };
  };
  export default useNotesLinked;
  
  function useGetNoteMeta(project, noteIds) {
    const { data, loading, error } = useQuery(
    gql`
      query GetNoteForUser($noteIds: [ObjectId!], $partition: String!) {
        notes(query: { _id_in: $noteIds, _partition: $partition}) {
          _id
          questionCount
        }
      }
      `,
      { variables: { noteIds: noteIds, partition: `note=${project.id}`} }
    );
  
    
    if (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
    // If the query has finished, return the notes from the result data
    // Otherwise, return an empty list
    const notes = data?.notes;
    return { notes , loading };
  }