import { useState } from 'react'
import {
  Box,
  Popover,
  ListItem,
  ListItemText,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack
} from '@mui/material'
import { Button, Seperator } from '../../../utils'
import { EditNote, OpenInBrowser, SaveAs } from '@mui/icons-material'
import { Problem } from '../../../../types'
import { useNavigate } from 'react-router-dom'
import { CreatorEditorButton } from '../../problem-creator/creator-editor'
import axios from 'axios'
import { toast } from 'react-toastify'
import { config } from '../../../../../config'

type ProblemListItemProps = {
    problem: Problem
}

export const ProblemListItem = ({ problem }: ProblemListItemProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [template, setTemplate] = useState('class Problem: \n')
  const [solution, setSolution] = useState('class InternalProblem: \n')
  const [selectedLanguage, setSelectedLanguage] = useState('plaintext')
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProblemUpdate = () => {
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
  }

  const missingLanguages = ['PYTHON', 'JAVASCRIPT'].filter((language) => !problem.supportedLanguages.includes(language))

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const selectedLang = event.target.value as string
    setSelectedLanguage(selectedLang)

    if (selectedLang === 'PYTHON') {
      setTemplate('class Problem: \n')
      setSolution('class InternalProblem: \n')
    } else if (selectedLang === 'JAVASCRIPT') {
      setTemplate('class Problem {\n\n}')
      setSolution('class InternalProblem {\n\n}')
    }
  }

  const handleSave = async () => {
    try {
      const payload = {
        problem_id: problem.problemId,
        language: selectedLanguage,
        default_definition: template,
        reference_solution: solution,
      }
      await axios.post(`${config.apiBaseUrl}/problems/templates`, payload)

      toast.success('Template updated successfully')

      navigate(`/problems/${problem.problemId}`)
    } catch (error) {
      toast.error('Error updating template')
      console.error('Error updating template:', error)
    }
  }

  return (
    <>
      <ListItem component="button" onClick={handleClick}>
        <ListItemText primary={problem.name} />
      </ListItem>

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
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: 300,
          }}
        >
          <div className="container">
            <Typography variant="h5" style={{ textTransform: 'none' }}>
              {problem.name}
            </Typography>
          </div>
          <Seperator isHorizontal />
          <div className="container-column">
            <Button
              icon={<EditNote />}
              sx={{ width: '10rem', marginTop: '1rem' }}
              popup="Click to edit problem templates"
              onClick={handleProblemUpdate}
            >
              Update
            </Button>
            <Button
              icon={<OpenInBrowser />}
              sx={{ width: '10rem' }}
              popup="Click to open problem page"
              onClick={() => navigate(`/problems/${problem.problemId}`)}
            >
              Open
            </Button>
          </div>
        </Box>
      </Popover>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Update {problem.name}</DialogTitle>
        {missingLanguages.length > 0 ? (
          <>
            <DialogContent sx={{ minWidth: 300 }}>
              <InputLabel id="language-selector-label">Select Language</InputLabel>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <Select
                  labelId="language-selector-label"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                >
                  {missingLanguages.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language.charAt(0) + language.substring(1).toLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack direction="row" spacing={2} justifyContent="space-around">
                <CreatorEditorButton
                  icon={<SaveAs />}
                  title={'Template Editor'}
                  handleChange={setTemplate}
                  language={selectedLanguage}
                  savedCode={template}
                  aria-label='template-editor'
                />
                <CreatorEditorButton
                  icon={<EditNote />}
                  title={'Solution Editor'}
                  handleChange={setSolution}
                  language={selectedLanguage}
                  savedCode={solution}
                  aria-label='solution-editor'
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ marginTop: '1rem' }}>
              <Button
                onClick={handleDialogClose}
                popup='Click to cancel'
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={selectedLanguage === 'plaintext'}
                popup='Click to update with new template'
              >
                Save
              </Button>
            </DialogActions>
          </>
        ) : (
          <DialogContent>
            This problem has all currently available languages
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
