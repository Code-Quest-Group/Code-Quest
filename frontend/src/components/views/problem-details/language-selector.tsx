import React, { useState } from 'react'
import { Menu, MenuItem, IconButton, Typography, Button } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useCodeEnvironment } from '../../../providers'
import axios from 'axios'
import { config } from '../../../../config'

export const LanguageDropdown = () => {
  const {
    currentLanguage,
    setCurrentLanguage,
    problem,
    resetCodeToTemplate,
    setCurrentTemplate,
  } = useCodeEnvironment()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageSelect = async (language: string) => {
    try {
      const newTemplateData = await axios.get(`${config.apiBaseUrl}/problems/templates`, {
        params: {
          problemId: problem.problemId,
          language,
          templateType: 'DEFAULT_DEFINITION',
        },
      })

      setCurrentTemplate(newTemplateData.data.data[0].code)
    } catch (error) {
      console.error('Couldn\'t fetch error: ', error)
    }

    setCurrentLanguage(language.toLowerCase())
    handleClose()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', maxHeight: '1.8125rem' }}>
      <Typography variant="body1" style={{ marginRight: '0.5rem' }}>
        Language
      </Typography>
      <IconButton
        onClick={handleClick}
        aria-label="select language"
        style={{ backgroundColor: 'white', borderRadius: 0, width: '8rem' }}
      >
        <Typography variant='body1' style={{ textTransform: 'capitalize' }}>
          {currentLanguage.toLowerCase()}
        </Typography>
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {problem.supportedLanguages.map((language) => (
          <MenuItem key={language} onClick={() => handleLanguageSelect(language)}>
            {language.charAt(0) + language.substring(1).toLowerCase()}
          </MenuItem>
        ))}
      </Menu>
      <Button onClick={() => resetCodeToTemplate()}>
        <Typography variant="button" style={{ textTransform: 'none', marginLeft: '0.5rem', color: '#125497' }}>
          Reset Environment
        </Typography>
      </Button>
    </div>
  )
}
