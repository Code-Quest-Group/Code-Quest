import Editor from '@monaco-editor/react'
import { useCodeEnvironment } from '../../../providers'

export const CodeEditor = () => {
  const { code, setCode } = useCodeEnvironment()

  return (
    <Editor
      height="32rem"
      defaultLanguage="python"
      value={code}
      onChange={(value) => setCode(value ?? '')}
      theme="vs-light"
    />
  )
}
