import React, { useRef, useCallback } from 'react';
import { createEditor, Transforms, Editor, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import {
  Paragraph,
  TitleElement,
  OrderedListItem,
  DottedListItem,
  StarElement,
  QuestionBlock,
  PropertyBlock,
  Leaf
} from './Elements'
import { noteLayout } from './NoteLayout';
import { useBeforeunload } from 'react-beforeunload';


const HunchEditor = (props) => {

    // Initiate Editor
    const editorRef = useRef()
    if (!editorRef.current) editorRef.current = noteLayout(withHistory(withReact(createEditor())));
    const editor = editorRef.current;

    // Initiate State
    const value = props.value;
    const handleChange = (value) => {
      props.handleChange(value);
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
        case 'question':
          return <QuestionBlock {...props} />
        case 'property':
          return <PropertyBlock {...props} />
        default:
            return <Paragraph {...props} />
      }
    }, [])

    // Save on window close
    useBeforeunload(() => {
      if (value) {
        props.saveNote();
      }
    });

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

              // Create Link
              if (event.metaKey && event.key === '[') {
                  event.preventDefault();
                  const [node] = Editor.node(editor, editor.selection);
                    if (!node.text) return;

                  const [match] = Editor.nodes(editor, {
                    match: n => n.type === 'link',
                  })

                  Transforms.setNodes(
                      editor,
                      {
                        type: match ? 'text' : 'link',
                        linkNoteId: props.newNote(node.text)
                      },
                      { match: n => Text.isText(n), split: match ? false : true}
                  );

                  // const [node] = Editor.node(editor, editor.selection);
                  //   if (!node.text) return;

                  // const selectedText = node.text.slice(
                  //     editor.selection.anchor.offset,
                  //     editor.selection.focus.offset
                  // );

                //   const graph = data.graph

                //   NewNote(graph, id, newNoteId, selectedText)

              }

              // Navigate to Link
              if (event.metaKey && event.key === 'y') {
                  event.preventDefault();
                  let selectedId = '';
                  Transforms.setNodes(
                      editor,
                      { },
                      { match: n => {
                        selectedId = n.linkNoteId;
                        return false
                      }}
                  );

                  if (!selectedId) return;
                  props.getNote(selectedId);
              }

              // Logout
              if (event.metaKey && event.key === 'Escape') {
                event.preventDefault();
                props.logout();
              }

              // ListView
              if (event.metaKey && event.key === 'u') {
                event.preventDefault();
                props.setIsListView(!props.isListView);
              }

              if (props.isListView === true && event.key) {
                event.preventDefault();
              }

              if (props.isListView === true && event.key === 'Escape') {
                event.preventDefault();
                props.setIsListView(!props.isListView);
              }

              // Save Note
              if (event.metaKey && event.key === 's') {
                  event.preventDefault();
                  props.saveNote();
              }

              // Property
              if (event.metaKey && event.key === '7') {
                  event.preventDefault();
                  const [match] = Editor.nodes(editor, {
                    match: n => n.type === 'property',
                  })
                  Transforms.setNodes(
                      editor,
                      { type: match ? 'paragraph': 'property'},
                      { match: n => Editor.isBlock(editor, n) }
                  );
              }


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

              // Question Block
              if (event.metaKey && event.key === 'e') {
                event.preventDefault();
                const [match] = Editor.nodes(editor, {
                  match: n => n.type === 'question',
                })
                Transforms.setNodes(
                    editor,
                    { type: match ? 'paragraph': 'question'},
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
              if (event.key === 'Enter' && !props.isAction && !props.isListView) {
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

              // Indicator Styling
              if (event.metaKey && event.key === 'k') {
                event.preventDefault();
                const [match] = Editor.nodes(editor, {
                  match: n => n.link === true,
                })
                Transforms.setNodes(
                    editor,
                    { link: match ? false : true },
                    { match: n => Text.isText(n), split: match ? false : true}
                );
            }
            }}
          />
      </Slate>
      </>
    )
}

export default HunchEditor;
