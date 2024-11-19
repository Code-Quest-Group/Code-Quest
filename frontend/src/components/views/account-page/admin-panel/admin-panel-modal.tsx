import { Box, List, Modal } from '@mui/material'
import classes from './admin-panel-modal.module.scss'
import { Seperator } from '../../../utils'
import { useEffect, useState } from 'react'
import { ProblemService } from '../../../../services/problem-service'
import { Problem, User } from '../../../../types'
import { Proposal } from '../../../../types/problem/proposal.type'
import { ProposalListItem } from './proposal-list-item'
import { ProblemListItem } from './problem-list-item'
import { UserListItem } from './user-list-item'

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
};

const tmpProblemProposals: Proposal[] = [
  {
    name: 'Sort List Problem 1',
    author: 'Joohn Boon',
    description: 'Some description...',
    codeTemplate: 'Some template...',
    correctSolution: 'Some solution...',
    constraints: '0 < num < 10',
    example: '[3, 2, 3, 1] => [1, 2, 3, 3]',
    tags: ['huh'],
  },
  {
    name: 'Find Maximum Subarray',
    author: 'Alice Green',
    description: 'Given an array of integers, find the contiguous subarray which has largest sum and return its sum.',
    codeTemplate: 'function maxSubArray(nums) { // Your code here }',
    correctSolution: 'Use Kadane’s Algorithm to find the maximum subarray sum.',
    constraints: '-10^4 <= nums[i] <= 10^4, 1 <= nums.length <= 10^5',
    example: '[1, -2, 3, 4, -1, 2, 1, -5, 4] => 8',
    tags: ['huh'],
  },
]

const tmpUsers: User[] = [
  { username: 'Joohn Boon' },
  { username: 'Dadamio' },
  { username: 'Alice Green' },
  { username: 'Robert Black' },
  { username: 'Charlie White' },
  { username: 'Emma Stone' },
  { username: 'John Doe' },
  { username: 'Jane Smith' },
  { username: 'Chris Pratt' },
  { username: 'Liam Neeson' },
  { username: 'Olivia Wilde' },
  { username: 'Will Smith' },
  { username: 'Scarlett Johansson' },
  { username: 'Tom Hanks' },
  { username: 'Rachel Green' },
  { username: 'Ross Geller' },
  { username: 'Chandler Bing' },
  { username: 'Monica Geller' },
  { username: 'Phoebe Buffay' },
  { username: 'Joey Tribbiani' }
]

export const AdminPanel = ({ open, onClose }: FeedbackModalProps) => {
  const [problems, setProblems] = useState<Problem[]>([ ])

  useEffect(() => {
    const fetchProblems = async() => {
      try {
        const data = await ProblemService.getProblems()
        setProblems(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProblems()
  }, [])

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-admin-panel"
      aria-describedby="modal-admin-panel-for-proposals-users-and-problems"
    >
      <Box className={classes.contentCard}>
        <div className={classes.content}>
          <section>
            <header>Problem proposals</header>
            <Seperator isHorizontal />
            <List>
              {tmpProblemProposals.map((problem, index) => (
                <ProposalListItem problemProposal={problem} key={index}/>
              ))}
            </List>
          </section>
          <section>
            <header>Current problems</header>
            <Seperator isHorizontal />
            <List>
              {problems.map((problem, index) => (
                <ProblemListItem problem={problem} key={index}/>
              ))}
            </List>
          </section>
          <section>
            <header>Users</header>
            <Seperator isHorizontal />
            <List>
              {tmpUsers.map((user, index) => (
                <UserListItem user={user} key={index}/>
              ))}
            </List>
          </section>
        </div>
      </Box>
    </Modal>
  )
}
