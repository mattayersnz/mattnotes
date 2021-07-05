import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

export default function useNoteMutations(project) {
  return {
    createNote: useCreateNote(project),
    updateNote: useUpdateNote(project),
    deleteNote: useDeleteNote(project),
  };
}

const CreateNoteMutation = gql`
  mutation CreateNote($note: NoteInsertInput!) {
    createdNote: insertOneNote(data: $note) {
      _partition
      ownerId
    }
  }
`;

const UpdateNoteMutation = gql`
  mutation UpdateNote($noteId: ObjectId!, $updates: NoteUpdateInput!) {
    updatedNote: updateOneNote(query: { _id: $noteId }, set: $updates) {
      _id
      _partition
    }
  }
`;

const DeleteNoteMutation = gql`
  mutation DeleteNote($noteId: ObjectId!) {
    deletedNote: deleteOneNote(query: { _id: noteId }) {
      _id
      _partition
      status
    }
  }
`;

const NoteFieldsFragment = gql`
  fragment NoteFields on Note {
    _id
    _partition
    status
    name
  }
`;

function useCreateNote(project) {
  const [createNoteMutation] = useMutation(CreateNoteMutation, {
    // Manually save added Notes into the Apollo cache so that Note queries automatically update
    // For details, refer to https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    update: (cache, { data: { createdNote } }) => {
      cache.modify({
        fields: {
          notes: (existingNotes = []) => [
            ...existingNotes,
            cache.writeFragment({
              data: createdNote,
              fragment: NoteFieldsFragment,
            }),
          ],
        },
      });
    },
  });

  const createNote = async (note) => {
    const { createdNote } = await createNoteMutation({
      variables: {
        note: {
          _partition: `note=${project.id}`,
          ownerId: project.id,
          ...note,
        },
      }
    });
   
    return createdNote;
  };
  return createNote;
}

function useUpdateNote(project) {
  const [updateNoteMutation] = useMutation(UpdateNoteMutation);
  const updateNote = async (noteId, updates) => {
    const { updatedNote } = await updateNoteMutation({
      variables: { noteId: noteId, updates },
    });
    return updatedNote;
  };
  return updateNote;
}

function useDeleteNote(project) {
  const [deleteNoteMutation] = useMutation(DeleteNoteMutation);
  const deleteNote = async (note) => {
    const { deletedNote } = await deleteNoteMutation({
      variables: { noteId: note._id },
    });
    return deletedNote;
  };
  return deleteNote;
}