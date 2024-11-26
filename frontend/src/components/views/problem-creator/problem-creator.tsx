import clsx from 'clsx'
import classes from './problem-creator.module.scss'
import { useLayout } from '../../../providers'
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { FormEvent, useState } from 'react'
import { Button, Seperator } from '../../utils'
import { Tags } from '../../../types/problem/tags.type'
import { FiltersButton } from '../problem-list/filters-button'
import { EditNote, LocalOffer, Publish, SaveAs, Visibility } from '@mui/icons-material'
import { CreatorEditorButton } from './creator-editor'

const ProblemCreator = () => {
  const { showNavbar } = useLayout()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [constraints, setConstraints] = useState('')
  const [example, setExample] = useState('')
  const [testCases, setTestCases] = useState('')
  const [expectedResults, setExpectedResults] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tags[]>([])
  const [language, setLanguage] = useState('PYTHON')
  const [hints, setHints] = useState('')
  const [template, setTemplate] = useState('')
  const [solution, setSolution] = useState('')
  const [inputFormat, setInputFormat] = useState('')

  const [errors, setErrors] = useState({
    title: false,
    description: false,
    constraints: false,
    example: false,
    testCases: false,
    expectedResults: false,
    selectedTags: false,
    template: false,
    solution: false,
    inputFormat: false,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    setLanguage(event.target.value as string)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newErrors = {
      title: title.trim() === '',
      description: description.trim() === '',
      constraints: constraints.trim() === '',
      example: example.trim() === '',
      testCases: testCases.trim() === '',
      expectedResults: expectedResults.trim() === '',
      selectedTags: selectedTags.length === 0,
      template: template.length === 0,
      solution: solution.length === 0,
      inputFormat: inputFormat.trim() === '',
    }
    setErrors(newErrors)

    console.log('Submitting:', { title, description, constraints, example, testCases, expectedResults, selectedTags, language, hints })
  }

  return (
    <main className={clsx({ 'full-height': !showNavbar })}>
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
              />
            </section>
            <section>
              <TextField
                label="Constraints"
                variant="outlined"
                multiline
                rows={3}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                margin="normal"
                error={errors.constraints}
                helperText={errors.constraints ? 'Constraints are required' : ''}
              />
              <TextField
                label="Example"
                variant="outlined"
                multiline
                rows={3}
                value={example}
                onChange={(e) => setExample(e.target.value)}
                margin="normal"
                error={errors.example}
                helperText={errors.example ? 'Example is required' : ''}
              />
            </section>
            <section>
              <TextField
                label="Test Cases"
                variant="outlined"
                fullWidth
                value={testCases}
                onChange={(e) => setTestCases(e.target.value)}
                margin="normal"
                error={errors.testCases}
                helperText={errors.testCases ? 'Test cases are required' : ''}
              />
              <TextField
                label="Expected Results"
                variant="outlined"
                fullWidth
                value={expectedResults}
                onChange={(e) => setExpectedResults(e.target.value)}
                margin="normal"
                error={errors.expectedResults}
                helperText={errors.expectedResults ? 'Expected results are required' : ''}
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
              />
              <CreatorEditorButton
                icon={<EditNote />}
                title={'Solution Editor'}
                handleChange={setSolution}
                language={language}
                savedCode={solution}
              />
              <Button icon={<Visibility />} onClick={() => alert('not implemented')}>
                <Typography variant="button" style={{ textTransform: 'none' }}>
                  Preview
                </Typography>
              </Button>
              <Button type="submit" icon={<Publish />}>
                <Typography variant="button" style={{ textTransform: 'none' }}>
                  Submit
                </Typography>
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
