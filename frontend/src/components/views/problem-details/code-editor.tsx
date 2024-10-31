import Editor from '@monaco-editor/react'
import { useCodeEnvironment } from '../../../providers'

export const CodeEditor = () => {
  const { code, setCode } = useCodeEnvironment()

  const handleEditorChange = (value: string) => {
    setCode(value)
  }

  return (
    <Editor
      height="32rem"
      defaultLanguage="python"
      value={code}
      onChange={handleEditorChange}
      theme="vs-light"
    />
  )
}
