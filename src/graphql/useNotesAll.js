import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const useAllNotes = (project) => {
  const { notes, loading } = useGetNote(project);
  return {
    loadingAllNotes: loading,
    notes,
  };
};
export default useAllNotes;

function useGetNote(project) {

  const { data, loading, error } = useQuery(
  gql`
    ${allNotesGql}
    `,
    { variables: { partition: [`note=${project.id}`]} }
  );

  if (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }
  // If the query has finished, return the notes from the result data
  // Otherwise, return an empty list
  const notes = data?.notes;
  return { notes, loading };
}

var allNotesGql = `
query GetNotesForUser($partition: [String!]) {
  notes(query: { _partition_in: $partition }) {
    _id
    title
  }
}`;
