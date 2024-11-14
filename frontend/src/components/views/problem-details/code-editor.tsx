import Editor from '@monaco-editor/react'
import { useCodeEnvironment } from '../../../providers'
import { Seperator } from '../../utils'

type CodeEditorProps = {
  className?: string
}

export const CodeEditor = ({ className }: CodeEditorProps) => {
  const { code, setCode, currentLanguage } = useCodeEnvironment()

  return (
    <div className='container'>
      <Seperator isHorizontal />
      <Editor
        key={`code-editor-${currentLanguage}`}
        height="max(50vh, 30rem)"
        defaultLanguage='python'
        language={currentLanguage}
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
        }}
        className={className}
      />
      <Seperator isHorizontal />
    </div>
  )
}
