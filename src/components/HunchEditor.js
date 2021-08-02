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


const doesLinkedNoteIdExist = (selectedId, notesMeta) => {
  const noteMeta = notesMeta.find(n => n._id === selectedId);
  return !!noteMeta;
}

const HunchEditor = (props) => {

    // Initiate Editor
    const editorRef = useRef()
    if (!editorRef.current) editorRef.current = noteLayout(withHistory(withReact(createEditor())));
    const editor = editorRef.current;

    // Initiate State
    const { notesMeta, isMetaDataLoading, value } = props;
    const handleChange = (value) => {
      props.handleChange(value);
      if (!editor.selection) return;
          props.setAnchor(editor.selection.anchor.offset);

      const [node] = Editor.node(editor, editor.selection);
      if (!node.text) return;

      const textToSelection = node.text.slice(
          editor.selection.anchor.offset - 2,
          editor.selection.anchor.offset
      );

      props.setPrefix(textToSelection);

      if (textToSelection === '[[') {
          props.setIsSuggesting(true);
      }

    };

    // Render Leaves & Elements
    const renderLeaf = useCallback(props => {
        return <Leaf {...props} notesMeta={notesMeta} isMetaDataLoading={isMetaDataLoading}/>
    }, [notesMeta, isMetaDataLoading])
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
              if (event.metaKey && event.key === 'l') {
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
                  
                  //check if selectedId exists in metadata
                  if (!selectedId || !doesLinkedNoteIdExist(selectedId, notesMeta)) return;

                  props.getNote(selectedId);
              }

              // Logout
              if (event.metaKey && event.key === 'Escape') {
                event.preventDefault();
                props.logout();
              }

              // ListView
              if (event.metaKey && event.key === 'g') {
                event.preventDefault();
                props.setIsCommand(false)
                props.setIsListView(!props.isListView);
              }

              if (props.isListView === true && event.key) {
                event.preventDefault();
              }

              if (props.isListView === true && event.key === 'Escape') {
                event.preventDefault();
                props.setIsListView(!props.isListView);
              }

              // NoteSuggest
              if (props.isSuggesting === true && event.key !== 'Backspace') {
                event.preventDefault();
              }

              if (props.isSuggesting === true && event.key === 'Escape') {
                event.preventDefault();
                props.setIsSuggesting(!props.isSuggesting);
                props.setIsTyping(false);
              }


              // Command
              if (event.metaKey && event.key === 'k') {
                event.preventDefault();
                props.setIsCommand(!props.isCommand);
              }

              if (props.isListView === true && event.key) {
                event.preventDefault();
              }

              if (props.isCommand === true && event.key === 'Escape') {
                event.preventDefault();
                props.setIsCommand(!props.isCommand);
              }

              // Save Note
              if (event.metaKey && event.key === 's') {
                  event.preventDefault();
                  props.saveNote();
              }

              // Delete Note
              if (event.metaKey && event.key === '\\') {
                event.preventDefault();
                props.deleteNote();
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

              // Property
              if (event.metaKey && event.key === '2') {
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

              // Star Block
              if (event.metaKey && event.key === '3') {
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
              if (event.metaKey && event.key === '4') {
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

              // // Cycle Links
              // if (event.metaKey && event.key === '8') {
              //   event.preventDefault();
              //   console.log("Links", props.linkedNoteIds)
              // }

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
              if (event.key === 'Escape' && !props.isAction) {
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
                      match: n => n.type === 'question' || 'star' || 'property' || 'link'
                  })

                  if (match) {
                    event.preventDefault()
                    Transforms.insertNodes(editor, [{
                      "type": "paragraph",
                      "children": [{ "text": "" }]
                    }])
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

              // Underline Styling
              if (event.metaKey && event.key === 'u') {
                  event.preventDefault();
                  const [match] = Editor.nodes(editor, {
                    match: n => n.underline === true,
                  })
                  Transforms.setNodes(
                      editor,
                      { underline: match ? false : true },
                      { match: n => Text.isText(n), split: match ? false : true}
                  );
              }

              // Italic Styling
              if (event.metaKey && event.key === 'i') {
                  event.preventDefault();
                  const [match] = Editor.nodes(editor, {
                    match: n => n.italic === true,
                  })
                  Transforms.setNodes(
                      editor,
                      { italic: match ? false : true },
                      { match: n => Text.isText(n), split: match ? false : true}
                  );
              }

              // Strikethrough Styling
              if (event.metaKey && event.key === 'd') {
                event.preventDefault();
                const [match] = Editor.nodes(editor, {
                  match: n => n.strikethrough === true,
                })
                Transforms.setNodes(
                    editor,
                    { strikethrough: match ? false : true },
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
