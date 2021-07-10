// import { useQuery } from "@apollo/client";
// import gql from "graphql-tag";
import useUserMutations from "./useUserMutations";

const useUsers = (project) => {
  // const { user, loading } = useGetUser(project, noteId);
  const { updateUser } = useUserMutations(project);
  return {
    // loading,
    // user,
    updateUser,
  };
};
export default useUsers;

// function useGetUser(project) {
//   const { data, loading, error } = useQuery(
//     gql`
//     query GetUser($userId: ObjectId!, $partition: String!) {
//       note(query: { _id: $userId, _partition: $partition}) {
//         _id
//         _partition
//       }
//     }
//     `,
//     { variables: { userId: project.id, partition: `user=${project.id}`} }
//   );
//   if (error) {
//     throw new Error(`Failed to fetch user: ${error.message}`);
//   }
//   // If the query has finished, return the notes from the result data
//   // Otherwise, return an empty list
//   const user = data?.user;
//   return { user, loading };
// }