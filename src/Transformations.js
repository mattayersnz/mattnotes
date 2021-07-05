export const GetTitle = (graph) => {
   // Get title block within note
    return graph.blocks.find(block =>
      block.type === 'title'
    ).children[0].text;
};

export const NewNote = (graph, backLinkNoteId, linkText) => {
    graph.blocks.push({
      blocks: [
        {
          "type": "title",
          "children": [{"text": linkText}]
        },
        {
          "type": "paragraph",
          "children": [{"text": "This note links to: "}]
        },
        {
          "type": "paragraph",
          "children": [
            {
              "text": GetTitle(graph, backLinkNoteId),
              "link": true,
              "noteId": backLinkNoteId
            }
          ]
        }
      ]
    })
  console.log(graph);

  // return notes[0];
};
