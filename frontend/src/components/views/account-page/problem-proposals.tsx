import { MenuList, MenuItem, ListItemText } from '@mui/material'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { config } from '../../../../config'
import { Proposal } from '../../../types'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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
            onClick={() => {
              if (submission.problem_status !== 'APPROVED') {
                toast.info('Can\'t visit this page, as it wasn\'t approved by administration.')
                return
              }
              navigate(`/problems/${submission.problem_id}`)
            }}
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
