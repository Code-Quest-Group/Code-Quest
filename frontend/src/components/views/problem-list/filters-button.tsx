import { ReactNode, useState } from 'react'
import { Box, Popover, Chip} from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { Button } from '../../utils'
import { Tags } from '../../../types/problem/tags.type'

type FiltersButtonProps = {
    // eslint-disable-next-line no-unused-vars
    onFiltersChange: (selectedTags: Tags[]) => void
    title?: string
    icon?: ReactNode
    topPosition?: boolean
}

export const FiltersButton = ({ onFiltersChange, title, icon, topPosition }: FiltersButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleTagClick = (tag: Tags) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]

    setSelectedTags(updatedTags)
    onFiltersChange(updatedTags as Tags[])
  }

  return (
    <>
      <Button
        aria-label='open-filters-button'
        onClick={handleClick}
        icon={icon ?? <FilterAltIcon />}
        popup={'Click to open filters selector'}
      >
        {title ?? 'Filters'}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: topPosition ? 'top' : 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: topPosition ? 'bottom' : 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          width: 300,
          height: '100%',
        }}
        >
          {Object.values(Tags).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              clickable
              color={selectedTags.includes(tag) ? 'primary' : 'default'}
              onClick={() => handleTagClick(tag)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Popover>
    </>
  )
}
