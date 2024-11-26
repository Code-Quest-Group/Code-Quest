import { Editor, OnMount } from '@monaco-editor/react'
import { Button } from '../../utils'
import { Typography, Popover, Box } from '@mui/material'
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from 'react'

type CreatorEditorButtonProps = {
    title: string
    icon: ReactNode
    handleChange: Dispatch<SetStateAction<string>>
    language: string
    savedCode: string
}

export const CreatorEditorButton = ({ title, handleChange, icon, language, savedCode }: CreatorEditorButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, language.toLowerCase() || 'plaintext')
    }
  }

  return (
    <>
      <Button
        aria-describedby='open-template-editor'
        onClick={handleClick}
        popup={'Click open code editor'}
        icon={icon}
      >
        <Typography variant="button" style={{ textTransform: 'none' }}>
          {title}
        </Typography>
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: 400,
          height: 400,
        }}>
          <Editor
            onMount={handleEditorMount}
            onChange={(value) => handleChange(value ?? '')}
            theme="vs-light"
            value={savedCode}
            options={{
              scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
              },
              scrollBeyondLastLine: false,
              minimap: {
                enabled: false,
              },
            }}
          />
        </Box>
      </Popover>
    </>
  )
}
