/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx'
import classes from './problem-creator.module.scss'
import { useUser } from '../../../providers'
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { FormEvent, useState } from 'react'
import { Button, Seperator } from '../../utils'
import { Tags } from '../../../types/problem/tags.type'
import { FiltersButton } from '../problem-list/filters-button'
import { EditNote, LocalOffer, Publish, SaveAs, Visibility } from '@mui/icons-material'
import { CreatorEditorButton } from './creator-editor'
import { Problem } from '../../../types'
import { toast } from 'react-toastify'
import { config } from '../../../../config'
import axios, { isAxiosError } from 'axios'

const ProblemCreator = () => {
  const { setUserProblem } = useUser()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [constraints, setConstraints] = useState('')
  const [testCases, setTestCases] = useState('')
  const [exampleTestCases, setExampleTestCases] = useState('')
  const [exampleExpectedResults, setExampleExpectedResults] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tags[]>([])
  const [language, setLanguage] = useState('PYTHON')
  const [hints, setHints] = useState('')
  const [template, setTemplate] = useState('class Problem: \n')
  const [solution, setSolution] = useState('class InternalProblem: \n')
  const [inputFormat, setInputFormat] = useState('')

  const [errors, setErrors] = useState({
    title: false,
    description: false,
    constraints: false,
    testCases: false,
    exampleTestCases: false,
    exampleExpectedResults: false,
    selectedTags: false,
    template: false,
    solution: false,
    inputFormat: false,
    hints: false,
  })

  const checkErrors = (): boolean => {
    const newErrors = {
      title: title.trim() === '',
      description: description.trim() === '',
      constraints: constraints.trim() === '',
      exampleTestCases: exampleTestCases.trim() === '',
      exampleExpectedResults: exampleExpectedResults.trim() === '',
      selectedTags: selectedTags.length === 0,
      template: template.length === 0,
      solution: solution.length === 0,
      inputFormat: inputFormat.trim() === '',
      testCases: testCases.trim() === '',
      hints: hints.trim() === '',
    }

    setErrors(newErrors)
    if (errors.solution || errors.template) toast.warning('Make sure that code templates are finished')

    return Object.values(newErrors).some((error) => error === true)
  }

  const handleChange = (event: any) => {
    setLanguage(event.target.value as string)
  }

  const handlePreview = () => {
    const problemPreview: Problem = {
      problemId: 'preview-problem',
      name: title,
      description,
      constraints,
      supportedLanguages: [language],
      inputFormat,
      codeTemplate: template,
      tags: [...selectedTags],
      hints: hints.trim().split('\n'),
      exampleTestCases: exampleTestCases,
      exampleExpectedResults: exampleExpectedResults.trim().split('\n'),
      rating: 5
    }

    if (checkErrors()) return

    setUserProblem(undefined)
    setUserProblem(problemPreview)
    window.open('/problem-creator/preview', '_blank')
  }

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (checkErrors()) return

    const payload = {
      problemId: title.toLowerCase().replace(/\d+/g, '').replace(/\s+/g, '-'),
      name: title,
      description: description,
      supported_language: language,
      input_format: inputFormat,
      code_template: template,
      reference_solution: solution,
      test_cases: testCases,
      hints: hints.split('\n'),
      tags: selectedTags,
      example_testcases: exampleTestCases,
      example_expected_result: exampleExpectedResults.split('\n').filter(item => item.trim() !== ''),
      constraints: constraints,
    }

    try {
      await axios.post(`${config.apiBaseUrl}/problems/proposals`, payload)

      toast.success('Problem created successfully.')

      setTitle('')
      setDescription('')
      setConstraints('')
      setTestCases('')
      setExampleTestCases('')
      setExampleExpectedResults('')
      setSelectedTags([])
      setLanguage('PYTHON')
      setHints('')
      setTemplate('class Problem: \n')
      setSolution('class InternalProblem: \n')
      setInputFormat('')

      setUserProblem(undefined)
      setErrors({
        title: false,
        description: false,
        constraints: false,
        testCases: false,
        exampleTestCases: false,
        exampleExpectedResults: false,
        selectedTags: false,
        template: false,
        solution: false,
        inputFormat: false,
        hints: false,
      })
    } catch (error: unknown) {
      console.error('Error creating problem:', error)

      let errorMessage = 'An unknown error occurred'

      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error('Failed to create problem: ' + errorMessage, { autoClose: 30000 })
    }
  }

  return (
    <main>
      <div className={classes.problemCreatorContainer}>
        <div className={classes.creatorFormContainer}>
          <h1>Problem Creator</h1>
          <Seperator isHorizontal />
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              error={errors.title}
              helperText={errors.title ? 'Title is required' : ''}
            />
            <section>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
                error={errors.description}
                helperText={errors.description ? 'Description is required' : ''}
              />
              <TextField
                label="Hints"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={hints}
                onChange={(e) => setHints(e.target.value)}
                margin="normal"
                error={errors.hints}
                helperText={errors.hints ? 'Hints are required' : ''}
              />
            </section>
            <section>
              <TextField
                label="Example Test Cases"
                variant="outlined"
                multiline
                rows={3}
                value={exampleTestCases}
                onChange={(e) => setExampleTestCases(e.target.value)}
                margin="normal"
                error={errors.exampleTestCases}
                helperText={errors.exampleTestCases ? 'Example test cases are required' : ''}
              />
              <TextField
                label="Expected Results"
                variant="outlined"
                multiline
                rows={3}
                value={exampleExpectedResults}
                onChange={(e) => setExampleExpectedResults(e.target.value)}
                margin="normal"
                error={errors.exampleExpectedResults}
                helperText={errors.exampleExpectedResults ? 'Expected results are required' : ''}
              />
            </section>
            <section>
              <TextField
                label="Test Cases"
                variant="outlined"
                multiline
                maxRows={1}
                value={testCases}
                onChange={(e) => setTestCases(e.target.value)}
                margin="normal"
                error={errors.testCases}
                helperText={errors.testCases ? 'Test cases are required' : ''}
              />
              <TextField
                label="Constraints"
                variant="outlined"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                margin="normal"
                error={errors.constraints}
                helperText={errors.constraints ? 'Constraints are required' : ''}
              />
            </section>
            <section>
              <FormControl>
                <InputLabel id="language-select-label">Language</InputLabel>
                <Select
                  labelId="language-select-label"
                  value={language}
                  onChange={handleChange}
                  label="Language"
                >
                  <MenuItem value="PYTHON">Python</MenuItem>
                  <MenuItem value="JAVASCRIPT">Javascript</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Input Format"
                variant="outlined"
                fullWidth
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                margin="none"
                error={errors.inputFormat}
                helperText={errors.inputFormat ? 'Input format is required' : ''}
              />
            </section>
            <section className={clsx('container', classes.buttonGroup)}>
              <FiltersButton onFiltersChange={setSelectedTags} title="Tags" icon={<LocalOffer />} topPosition/>
              <CreatorEditorButton
                icon={<SaveAs />}
                title={'Template Editor'}
                handleChange={setTemplate}
                language={language}
                savedCode={template}
                aria-label='template-editor'
              />
              <CreatorEditorButton
                icon={<EditNote />}
                title={'Solution Editor'}
                handleChange={setSolution}
                language={language}
                savedCode={solution}
                aria-label='solution-editor'
              />
              <Button icon={<Visibility />} onClick={handlePreview} aria-label='preview-problem'>
                Preview
              </Button>
              <Button type="submit" icon={<Publish />} aria-label='submit-problem'>
                Submit
              </Button>
            </section>
            {errors.selectedTags && <Typography color="error" className='container'>
              At least one tag is required
            </Typography>}
          </form>
        </div>
      </div>
    </main>
  )
}

export default ProblemCreator
