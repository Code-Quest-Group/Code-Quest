import Editor from '@monaco-editor/react'
import { useCodeEnvironment } from '../../../providers'
import { Seperator } from '../../utils'

export const CodeEditor = () => {
  const { code, setCode } = useCodeEnvironment()

  return (
    <div className='container'>
      <Seperator isHorizontal />
      <Editor
        height="max(50vh, 30rem)"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value ?? '')}
        theme="vs-light"
        options={{
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
          },
          scrollBeyondLastLine: false,
        }}
      />
      <Seperator isHorizontal />
    </div>
  )
}
