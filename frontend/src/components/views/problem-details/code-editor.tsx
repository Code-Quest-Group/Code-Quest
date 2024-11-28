import Editor, { loader, OnMount } from '@monaco-editor/react'
import { useCodeEnvironment } from '../../../providers'
import { Seperator } from '../../utils'
import { useEffect, useRef } from 'react'

type CodeEditorProps = {
  className?: string
  isFullscreen?: boolean
}

export const CodeEditor = ({ className, isFullscreen }: CodeEditorProps) => {
  const { code, setCode, currentLanguage } = useCodeEnvironment()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monaco.editor.setTheme(isFullscreen ? 'vs-dark' : 'vs-light')
  }

  useEffect(() => {
    if (!editorRef.current) return

    loader.init().then((monaco) => {
      const editor = editorRef.current
      const model = editor.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, currentLanguage.toLowerCase() || 'plaintext')
      }

      monaco.editor.setTheme(isFullscreen ? 'dark' : 'light')
    })
  }, [isFullscreen, currentLanguage])

  return (
    <div>
      <Seperator isHorizontal />
      <Editor
        onMount={handleEditorMount}
        height="max(50vh, 30rem)"
        defaultLanguage='python'
        value={code}
        onChange={(value) => setCode(value ?? '')}
        theme="vs-light"
        options={{
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
          },
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false,
          },
          fontSize: isFullscreen ? 32 : 14,
        }}
        className={className}
      />
      <Seperator isHorizontal />
    </div>
  )
}
