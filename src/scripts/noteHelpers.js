import cloneDeep from 'clone-deep';
import omitDeep from 'omit-deep';

export const createNewNoteBlocks = (backLinkNoteId, linkText) => {
  return {
    title: linkText,
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

const getQuestionCountFromNote = (blocks) => {
  let count = 0;
  blocks.forEach(block => {
    if (block.type === 'question') {
      count += 1;
    }
  });
  return count;
}

export const convertNoteToSaveFormat = (note, value) => {
    const graph = omitDeep(cloneDeep(note), ['__typename', '_id'])
    graph.blocks = value;
    graph.title = getTitleFromNote(graph.blocks);
    graph.questionCount = getQuestionCountFromNote(graph.blocks);
    return omitDeep(cloneDeep(graph), ['__typename', '_id'])
}

export const getLinkedNoteIdsFromNote = (blocks) => {
  let linkedNoteIds = [];
  blocks.forEach(block => {
    block.children.forEach(child => {
      child.linkNoteId && linkedNoteIds.push(child.linkNoteId);
    });
  });
  return linkedNoteIds;
}
