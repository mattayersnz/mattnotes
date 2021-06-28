import {
    Transforms,
    Node,
    Element as SlateElement,
  } from 'slate'
  
  // Forcing a Title block at the top of the note
  export const noteLayout = editor => {
    const { normalizeNode } = editor
  
    editor.normalizeNode = ([node, path]) => {
      if (path.length === 0) {
        if (editor.children.length < 1) {
          const title = {
            type: 'title',
            children: [{ text: 'Untitled' }],
          }
          Transforms.insertNodes(editor, title, { at: path.concat(0) })
        }
  
        for (const [child, childPath] of Node.children(editor, path)) {
          const type = childPath[0] === 0 ? 'title' : child.type
  
          if (SlateElement.isElement(child) && child.type !== type) {
            const newProperties = { type }
            Transforms.setNodes(editor, newProperties, { at: childPath })
          }
        }
      }
  
      return normalizeNode([node, path])
    }
  
    return editor
  }