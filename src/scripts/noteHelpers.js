import cloneDeep from 'clone-deep';
import omitDeep from 'omit-deep';

export const createNewNoteBlocks = (backLinkNoteId, linkText) => {
  return {
    blocks: [
      {
        "type": "title",
        "children": [{ "text": linkText }]
      },
      {
        "type": "paragraph",
        "children": [{ "text": "This note links to: " }]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "text": 'Hunch Note',
            "type": 'link',
            "linkNoteId": backLinkNoteId
          }
        ]
      }
    ]
  };
};

export const createInitialNoteBlocks = () => {
  return {
    blocks: [
      {
        type: 'title',
        children: [{ text: 'Thoughts...' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'go here' }],
      }
    ]
  }
}

const getTitleFromNote = (blocks) => {
   const noteName = blocks[0] &&  blocks[0].children[0] &&  blocks[0].children[0].text;
   return noteName || 'Title';
}

export const convertNoteToSaveFormat = (note, value) => {
    const graph = omitDeep(cloneDeep(note), ['__typename', '_id'])
    graph.blocks = value;
    graph.title = getTitleFromNote(graph.blocks);
    return omitDeep(cloneDeep(graph), ['__typename', '_id'])
}

