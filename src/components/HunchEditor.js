import React, { useRef, useCallback, useState } from 'react';
import { createEditor, Transforms, Editor, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import {
  Paragraph,
  TitleElement,
  OrderedListItem,
  DottedListItem,
  StarElement,
  Leaf
} from './Elements'
import { noteLayout } from './NoteLayout';
import { useQuery, useMutation } from "@apollo/client";
// import { SAVE_NOTES, GET_NOTE } from './ApolloCalls'
// import cloneDeep from 'clone-deep';
// import omitDeep from 'omit-deep';
// import { useBeforeunload } from 'react-beforeunload';
// import { NewNote } from './Transformations';
import { v4 as uuidv4 } from 'uuid';


const HunchEditor = (props) => {

    // Initiate Editor
    const editorRef = useRef()
    if (!editorRef.current) editorRef.current = noteLayout(withHistory(withReact(createEditor())));
    const editor = editorRef.current;

    // Initiate State
    // const [value, setValue] = useState(null);
    const [value, setValue] = useState(initialValue)
    const [id, setIdValue] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const handleChange = (value) => {
      setValue(value)
      setIdValue(id)
    };

    // Render Leaves & Elements
    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])
    const renderElement = useCallback(props => {
      switch (props.element.type) {
        case 'ol':
            return <OrderedListItem {...props}/>
        case 'ul':
            return <DottedListItem {...props}/>
        case 'title':
            return <TitleElement {...props} />
        case 'star':
            return <StarElement {...props} />
        default:
            return <Paragraph {...props} />
      }
    }, [])

    // // Save on window close
    // useBeforeunload((event) => {
    //   if (data.graph.blocks !== value) {
    //     const graph = omitDeep(cloneDeep(data), ['__typename', '_id'])
    //     graph.graph.blocks = value
    //     console.log("Graph", graph)
    //     saveNotes({variables: omitDeep(cloneDeep(graph), ['__typename', '_id'])});
    //   }
    // });

    // // GraphQL
    // const { loading, error, data } = useQuery(GET_NOTE);
    // const [saveNotes] = useMutation(SAVE_NOTES);
    // if (loading) return 'Loading...';
    // if (error) return `Error! ${error.message}`;
    // if (isLoaded === false) {
    //   handleChange(data.graph.blocks)
    //   setIsLoaded(true)
    // }

    // Render Editor
    return (
      <>
      <Slate
          editor={editor}
          value={value}
          onChange={newValue => handleChange(newValue)}
      >
        <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={event => {

              // Create Link -- NOT COMPLETE
              if (event.metaKey && event.key === '[') {
                  event.preventDefault();

                  const [match] = Editor.nodes(editor, {
                    match: n => n.link === true,
                  })

                  const newNoteId = uuidv4();
                  Transforms.setNodes(
                      editor,
                      {
                        link: match ? false: true,
                        noteId: newNoteId
                      },
                      { match: n => Text.isText(n), split: match ? false : true}
                  );

                  const [node] = Editor.node(editor, editor.selection);
                    if (!node.text) return;

                  const selectedText = node.text.slice(
                      editor.selection.anchor.offset,
                      editor.selection.focus.offset
                  );

                //   const graph = data.graph

                //   NewNote(graph, id, newNoteId, selectedText)

              }

              // Navigate to Link -- NOT COMPLETE
              // if (event.metaKey && event.key === 'y') {
              //     event.preventDefault();
              //     let selectedId = '';
              //
              //     Transforms.setNodes(
              //         editor,
              //         { },
              //         { match: n => {
              //           selectedId = n.noteId;
              //           return false
              //         }}
              //     );
              //
              //     if (!selectedId) return;
              //     updateNote(selectedId);
              // }

              // Save Note
            //   if (event.metaKey && event.key === 's') {
            //       event.preventDefault();
            //       const graph = omitDeep(cloneDeep(data), ['__typename', '_id'])
            //       graph.graph.blocks = value
            //       console.log("Note saved!", graph)
            //       saveNotes({variables: omitDeep(cloneDeep(graph), ['__typename', '_id'])});

            //   }

              // Title Block
              if (event.metaKey && event.key === ';') {
                  event.preventDefault();
                  const [match] = Editor.nodes(editor, {
                    match: n => n.type === 'title',
                  })
                  Transforms.setNodes(
                      editor,
                      { type: match ? 'paragraph': 'title' },
                      { match: n => Editor.isBlock(editor, n) }
                  );
              }

              // Star Block
              if (event.metaKey && event.key === '8') {
                  event.preventDefault();
                  const [match] = Editor.nodes(editor, {
                    match: n => n.type === 'star',
                  })
                  Transforms.setNodes(
                      editor,
                      { type: match ? 'paragraph': 'star'},
                      { match: n => Editor.isBlock(editor, n) }
                  );
              }

              // Unordered List Block
              if (event.metaKey && event.key === '-') {
                  event.preventDefault();
                  const [match] = Editor.nodes(editor, {
                    match: n => n.type === 'ul',
                  })
                  Transforms.setNodes(
                      editor,
                      { type: match ? 'paragraph': 'ul'},
                      { match: n => Editor.isBlock(editor, n) }
                  );
              }

              // Paragraph Block
              if (event.key === 'Escape') {
                  event.preventDefault()
                  Transforms.setNodes(
                      editor,
                      { type: 'paragraph' },
                      { match: n => Editor.isBlock(editor, n) }
                  )
              }

              // New Block
              if (event.key === 'Enter') {
                  const [match] = Editor.nodes(editor, {
                      match: n => n.type !== 'paragraph',
                  })
                  if (match) {
                    event.preventDefault()

                    Transforms.insertNodes(editor, [{
                      "type": "paragraph",
                      "children": [{"text": ""}]
                    }]
                    )
                  }
              }

              // Bold Styling
              if (event.metaKey && event.key === 'b') {
                  event.preventDefault();
                  const [match] = Editor.nodes(editor, {
                    match: n => n.bold === true,
                  })
                  Transforms.setNodes(
                      editor,
                      { bold: match ? false : true },
                      { match: n => Text.isText(n), split: match ? false : true}
                  );
              }

            }}
          />
      </Slate>
      </>
    )
}


const initialValue = [
    {
      type: 'paragraph',
      children: [
        { text: 'This is editable ' },
        { text: 'rich', bold: true },
        { text: ' text, ' },
        { text: 'much', italic: true },
        { text: ' better than a ' },
        { text: '<textarea>', code: true },
        { text: '!' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text:
            "Since it's rich text, you can do things like turn a selection of text ",
        },
        { text: 'bold', bold: true },
        {
          text:
            ', or add a semantically rendered block quote in the middle of the page, like this:',
        },
      ],
    },
    {
      type: 'block-quote',
      children: [{ text: 'A wise quote.' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Try it out for yourself!' }],
    },
  ]


export default HunchEditor;
