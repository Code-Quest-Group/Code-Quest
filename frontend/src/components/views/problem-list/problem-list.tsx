import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLayout, useUser } from '../../../providers'
import { ProblemService, UserService } from '../../../services/problem-service'
import { Problem } from '../../../types'
import classes from './problem-list.module.scss'
import { Button, Seperator } from '../../utils'
import { TextField } from '@mui/material'
import RecommendIcon from '@mui/icons-material/Recommend'
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { TagsList } from '../../utils/tags-list/tags-list'
import { FiltersButton } from './filters-button'
import { Tags } from '../../../types/problem/tags.type'

const MAXIMUM_PROBLEMS: number = 14

type UserProblemData = {
  [problemId: string]: string
}

const ProblemList = () => {
  const [problems, setProblems] = useState<Problem[]>([])
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Tags[]>([])
  const [userProblems, setUserProblems] = useState<UserProblemData>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { showNavbar } = useLayout()
  const navigate = useNavigate()
  const { userId } = useUser()

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

  useEffect(() => {
    const fetchUserProblems = async() => {
      if (!userId) return

      try {
        const data = await UserService.getUserProblems(userId)
        setUserProblems(data)
      } catch (error) {
        console.log('Error fetching user problems:', error)
      }
    }

    fetchUserProblems()
  }, [userId])

  useEffect(() => {
    const filtered = problems.filter((problem) => {
      const hasTags = Array.isArray(problem.tags)

      const matchesSearchTerm = problem.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilters = hasTags && selectedFilters.every((filterTag) =>
        (problem.tags).includes(filterTag as Tags)
      )

      return matchesSearchTerm && matchesFilters
    })

    setCurrentPage(1)
    setFilteredProblems(filtered)
  }, [searchTerm, selectedFilters, problems])

  const truncateName = (str: string) => str.length > 40 ? str.slice(0, 40) + '...' : str

  const pickRandomProblem = () => {
    if (problems.length === 0) {
      return null
    }

    const randomProblem = problems[Math.floor(Math.random() * problems.length)]
    navigate(`/problems/${randomProblem.problemId}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const paginateProblems = (problems: Problem[], currentPage: number) => {
    const startIndex = (currentPage - 1) * MAXIMUM_PROBLEMS
    const endIndex = startIndex + MAXIMUM_PROBLEMS
    return problems.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(filteredProblems.length / MAXIMUM_PROBLEMS)

  const getVisiblePages = (currentPage: number) => {
    let startPage = Math.max(1, currentPage - 1)
    let endPage = Math.min(totalPages, currentPage + 1)

    if (endPage - startPage < 2) {
      if (startPage > 1) {
        startPage = Math.max(1, endPage - 2)
      } else {
        endPage = Math.min(totalPages, startPage + 2)
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
  }

  return (
    <main className={clsx({'full-height': !showNavbar})}>
      <div className={classes.mainContent}>
        <section className={classes.topSection}>
          <div className={clsx('container', classes.uiContainer)}>
            <Button
              icon={<RecommendIcon />}
              popup={'Click to open recommended problem'}
              aria-label='Recommended Problem'
            >
              Recommended Problem
            </Button>
            <Button
              icon={<ShuffleOnIcon />}
              popup={'Click to open random problem'}
              onClick={pickRandomProblem}
              aria-label='Random Problem'
            >
              Pick Random
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
            {paginateProblems(filteredProblems, currentPage).map((problem, index) => {
              const problemStatus = userProblems && userProblems[problem.problemId]
                ? userProblems[problem.problemId].toLowerCase()
                : 'Untried'

              return (
                <li key={index} className={clsx({[classes.hoverEffect]: problem})}>
                  <Link to={`/problems/${problem.problemId}`}>
                    <header>{truncateName(problem.name)}</header>
                    <TagsList tags={problem.tags} />
                    <span className={clsx('inside-shadow',
                      {
                        [classes.accepted]: problemStatus === 'succeeded',
                        [classes.attempted]: problemStatus === 'attempted'
                      }
                    )}>
                      {problemStatus}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <section className={classes.bottomSection}>
          <Seperator isHorizontal />
          <div className={classes.paginationGroup}>
            {filteredProblems.length !== 0 ? (
              <>
                <div>
                  <Button
                    icon={<ArrowBackIosNewIcon style={{ fontSize: '1.75rem' }} />}
                    leftIcon
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className={clsx({['hidden']: currentPage === 1})}
                  >
                    Previous Page
                  </Button>
                </div>

                {getVisiblePages(currentPage).map((page) => (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={page === currentPage ? 'contained' : 'outlined'}
                  >
                    {page}
                  </Button>
                ))}

                <div>
                  <Button
                    icon={<ArrowForwardIosIcon />}
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={clsx({['hidden']: currentPage === totalPages})}
                  >
                    Next Page
                  </Button>
                </div>
              </>
            ) : (
              <div className='container'> No results fitting filters </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default ProblemList
