import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLayout } from '../../../providers'
import { ProblemService } from '../../../services/problem-service'
import { Problem } from '../../../types'
import classes from './problem-list.module.scss'
import { Button, Seperator } from '../../utils'
import { TextField, Typography } from '@mui/material'
import RecommendIcon from '@mui/icons-material/Recommend'
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { TagsList } from '../../utils/tags-list/tags-list'
import { FiltersButton } from './filters-button'
import { Tags } from '../../../types/problem/tags.type'

const MAXIMUM_PROBLEMS: number = 14
const tmpTags = ['Linked Lists', 'Binary Search', 'Recursion']

const ProblemList = () => {
  const [problems, setProblems] = useState<Problem[]>([ ])
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([ ])
  const [selectedFilters, setSelectedFilters] = useState<Tags[]>([ ])
  const [searchTerm, setSearchTerm] = useState('')
  const { showNavbar } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProblems = async() => {
      try {
        const data = await ProblemService.getProblems()
        setProblems(data)
        setFilteredProblems(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProblems()
  }, [])

  const truncateName = (str: string) => str.length > 40 ? str.slice(0, 40) + '...' : str

  const pickRandomProblem = () => {
    if (problems.length === 0) {
      return null
    }

    const randomProblem = problems[Math.floor(Math.random() * problems.length)]
    navigate(`/problems/${randomProblem.problemId}`)
  }

  useEffect(() => {
    const filtered = problems.filter((problem) => {
      const hasTags = Array.isArray(problem.tags ?? tmpTags)

      const matchesSearchTerm = problem.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilters = hasTags && selectedFilters.every((filterTag) =>
        (problem.tags ?? tmpTags).includes(filterTag as Tags)
      )

      return matchesSearchTerm && matchesFilters
    })

    setFilteredProblems(filtered)
  }, [searchTerm, selectedFilters, problems])

  return (
    <main className={clsx({'full-height': !showNavbar})}>
      <div className={classes.mainContent}>
        <section className={classes.topSection}>
          <div className={clsx('container', classes.uiContainer)}>
            <Button icon={<RecommendIcon />} popup={'Click to open recommended problem'}>
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Recommended Problem
              </Typography>
            </Button>
            <Button
              icon={<ShuffleOnIcon />}
              popup={'Click to open random problem'}
              onClick={pickRandomProblem}
            >
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Pick Random
              </Typography>
            </Button>
            <FiltersButton onFiltersChange={setSelectedFilters} />
            <TextField
              label="Search problem by name"
              variant="outlined"
              style={{ fontFamily: `'Fredoka', sans-serif`, fontSize: '1.125rem' }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Seperator isHorizontal />
        </section>
        <section className={classes.middleSection}>
          <ul>
            {filteredProblems.slice(0, MAXIMUM_PROBLEMS).map((problem, index) => (
              <li key={index} className={clsx({[classes.hoverEffect]: problem})}>
                <Link to={`/problems/${problem.problemId}`}>
                  <header>{truncateName(problem.name)}</header>
                  <TagsList tags={problem.tags ?? tmpTags}/>
                  <span className='inside-shadow'>Completed</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className={classes.bottomSection}>
          <Seperator isHorizontal />
          <div className={classes.paginationGroup}>
            <Button icon={<ArrowBackIosNewIcon style={{ fontSize: '1.75rem' }}/>} leftIcon>
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Previous Page
              </Typography>
            </Button>
            <Button>
              <Typography variant="button" style={{ textTransform: 'none' }}>
                1
              </Typography>
            </Button>
            <Button>
              <Typography variant="button" style={{ textTransform: 'none' }}>
                2
              </Typography>
            </Button>
            <Button>
              <Typography variant="button" style={{ textTransform: 'none' }}>
                3
              </Typography>
            </Button>
            <Button icon={<ArrowForwardIosIcon />}>
              <Typography variant="button" style={{ textTransform: 'none' }}>
                Next Page
              </Typography>
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ProblemList
