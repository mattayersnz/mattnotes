import { ObjectId } from "bson";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

export default function useNoteQueries(project) {
  return {
    getNote: useGetNote(project)
  };
}

export const GetNoteQuery = gql`
{
  graph(query: { owner: "60d98fc4933eb733f6fd4844"}) {
    _id
    blocks {
      type
      children {
        text
      }
    }
  }
}
`;

function useGetNote(project) {
  const [getNoteQuery] = useQuery(GetNoteQuery, {
    _id: project._id
  });

  const getNote = async (note) => {
    const { note } = await getNoteQuery({
      variables: {
        note: {
          _id: new ObjectId(),
          _partition: project.partition,
          status: "Active",
          ...note,
        },
      },
    });
    return note;
  };
  return getNote;
}