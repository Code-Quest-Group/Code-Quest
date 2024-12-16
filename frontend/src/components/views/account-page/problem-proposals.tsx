import { MenuList, MenuItem, ListItemText } from '@mui/material'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { config } from '../../../../config'
import { Proposal } from '../../../types'
import { useNavigate } from 'react-router-dom'

type ProblemProposalsProps = {
    userId: string
    rejected: string
    approved: string
    refresh?: boolean
}

export const ProblemProposals = ({ rejected, approved, userId, refresh }: ProblemProposalsProps) => {
  const [submissions, setSubmissions] = useState<Proposal[]>([ ])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/problems/proposals/${userId}`)
        console.log(response)
        setSubmissions(response.data)
      } catch (error) {
        console.error('Error fetching problem proposals:', error)
      }
    }

    if (userId) {
      fetchProposals()
    }
  }, [userId, refresh])

  return (
    <>
      {submissions.length ? (<MenuList>
        {submissions.map((submission, index) => (
          <MenuItem
            key={index}
            disableRipple
            onClick={() => navigate(`/problems/${submission.problem_id}`)}
          >
            <ListItemText primary={submission.name} />
            <span className={clsx('inside-shadow',
              {
                [approved]: submission.problem_status === 'APPROVED',
                [rejected]: submission.problem_status === 'REJECTED'
              }
            )}>
              {submission.problem_status}
            </span>
          </MenuItem>
        ))}
      </MenuList>
      ) : (
        <div className='container scrollable'>No user proposals found</div>
      )}
    </>
  )
}
