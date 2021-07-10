import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

export default function useUserMutations(project) {
  return {
    updateUser: useUpdateUser(project) 
  };
}

const UpdateUserMutation = gql`
  mutation UpdateUser($userId: String!, $partition: String!, $lastActiveNoteId: ObjectId!) {
    updatedUser: updateOneUser(query: { _id: $userId, _partition: $partition }, set: { lastActiveNoteId: $lastActiveNoteId }) {
      _id
      _partition
    }
  }
`;

function useUpdateUser(project) {
  const [updateUserMutation] = useMutation(UpdateUserMutation);
  const updateUser = async (updates) => {
    const { updatedUser } = await updateUserMutation({
      variables: { userId: project.id, partition: `user=${project.id}`, lastActiveNoteId: updates.lastActiveNoteId },
    });
    return updatedUser;
  };
  return updateUser;
}