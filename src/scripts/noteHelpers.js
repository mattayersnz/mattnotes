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
            "text": 'note maker',
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
