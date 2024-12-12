import { Box, List, Modal } from '@mui/material'
import classes from './admin-panel-modal.module.scss'
import { Seperator } from '../../../utils'
import { Fragment, useEffect, useState } from 'react'
import { ProblemService, UserService } from '../../../../services/problem-service'
import { Problem } from '../../../../types'
import { Proposal } from '../../../../types'
import { ProposalListItem } from './proposal-list-item'
import { ProblemListItem } from './problem-list-item'
import { BasicUserData, UserListItem } from './user-list-item'

type FeedbackModalProps = {
  open: boolean
  onClose: () => void
}

const AdminPanel = ({ open, onClose }: FeedbackModalProps) => {
  const [problems, setProblems] = useState<Problem[]>([ ])
  const [allUsers, setAllUsers] = useState<BasicUserData[]>([ ])
  const [proposals, setProposals] = useState<Proposal[]>([ ])

  useEffect(() => {
    const fetchProblems = async() => {
      try {
        const problemData = await ProblemService.getProblems()
        const usersData = await UserService.getAllUsers()
        const proposalsData = await ProblemService.getProposals()

        setAllUsers(usersData)
        setProblems(problemData)
        setProposals(proposalsData)
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
              <>
                {proposals.length ? (
                  <>
                    {proposals.map((proposal, index) => (
                      <Fragment key={index}>
                        <ProposalListItem problemProposal={proposal} />
                      </Fragment>
                    ))}
                  </>
                ) : (
                  <div className='container scrollable'>No active proposals found</div>
                )}
              </>
            </List>
          </section>
          <section>
            <header>Current problems</header>
            <Seperator isHorizontal />
            <List>
              {problems.map((problem, index) => (
                <Fragment key={index}>
                  <ProblemListItem problem={problem}/>
                </Fragment>
              ))}
            </List>
          </section>
          <section>
            <header>Users</header>
            <Seperator isHorizontal />
            <List>
              {allUsers.map((user, index) => (
                <Fragment key={index}>
                  <UserListItem user={user} />
                </Fragment>
              ))}
            </List>
          </section>
        </div>
      </Box>
    </Modal>
  )
}

export default AdminPanel
