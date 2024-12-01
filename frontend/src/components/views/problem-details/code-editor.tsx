import { useState, useEffect, useRef } from 'react'
import Editor, { loader, OnMount } from '@monaco-editor/react'
import { useCodeEnvironment } from '../../../providers'
import { Button, Seperator } from '../../utils'
import { Box, Typography } from '@mui/material'

type CodeEditorProps = {
  className?: string
  isFullscreen?: boolean
}

export const CodeEditor = ({ className, isFullscreen }: CodeEditorProps) => {
  const { code, setCode, currentLanguage } = useCodeEnvironment()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)

  const [isEditorVisible, setIsEditorVisible] = useState(false)

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

      monaco.editor.setTheme(isFullscreen ? 'vs-dark' : 'vs-light')
    })
  }, [isFullscreen, currentLanguage])

  return (
    <div>
      <Seperator isHorizontal />
      <Box
        sx={{
          height: 'max(50vh, 30rem)',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className={className}
      >
        {isEditorVisible ? (
          <Editor
            onMount={handleEditorMount}
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
        ): (
          <Button onClick={() => setIsEditorVisible(true)}>
            <Typography variant="button" style={{ textTransform: 'none' }}>
              Start Editor
            </Typography>
          </Button>
        )}
      </Box>

      <Seperator isHorizontal />
    </div>
  )
}
