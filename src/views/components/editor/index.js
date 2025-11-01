import { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const EditorStatic = ({ defaultState, isEdit, onChange }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [isDirty, setIsDirty] = useState(false) 

  useEffect(() => {
    if (defaultState && !isDirty) {
      const blocksFromHtml = htmlToDraft(defaultState)
      if (blocksFromHtml) {
        const contentState = ContentState.createFromBlockArray(
          blocksFromHtml.contentBlocks,
          blocksFromHtml.entityMap
        )
        setEditorState(EditorState.createWithContent(contentState))
      }
    }
  }, [defaultState, isDirty])

  const onEditorStateChange = (newEditorState) => {
    if (!isDirty) setIsDirty(true) 
    setEditorState(newEditorState)
    if (onChange) onChange(newEditorState)
  }

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      readOnly={!isEdit}
      toolbarHidden={!isEdit}
    />
  )
}

export default EditorStatic
