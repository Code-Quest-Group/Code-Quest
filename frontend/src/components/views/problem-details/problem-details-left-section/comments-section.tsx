import { useEffect, useState } from 'react'
import { useCodeEnvironment, useUser } from '../../../../providers'
import axios from 'axios'
import { Comment } from '../../../../types/problem/comment.type'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { config } from '../../../../../config'

type CommentsSectionProps = {
    commentClassName: string
}

export const CommentsSection = ({ commentClassName }: CommentsSectionProps) => {
  const { problem } = useCodeEnvironment()
  const { isAdmin, username } = useUser()
  const [comments, setComments] = useState<Comment[]>([])
  const problemId = problem.problemId
  const navigate = useNavigate()

  const handleDeleteComment = async(commentId: string) => {
    try {
      await axios.delete(`${config.apiBaseUrl}/problems/${problemId}/comments/${commentId}`)
      setComments((prevComments) => prevComments.filter((comment) => comment.comment_id !== commentId))
      toast.info(`Comment ${commentId} deleted successfully.`)
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error)
    }
  }

  useEffect(() => {
    const fetchComments = async() => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/problems/${problemId}/comments`)
        const fetchedComments = response.data as Comment[]
        setComments(fetchedComments)
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }

    if (problemId) {
      fetchComments()
    }
  }, [])

  return (
    <div className='scrollable'>
      <header className='header'> Comments </header>
      <>
        {comments ? (
          comments.map((comment, index) => (
            <div key={index} className={commentClassName}>
              <span>
                <header>
                  <button
                    onClick={() => navigate(`/account/${comment.user_id}`)}
                    className='header'
                  >
                    {comment.author}
                  </button>
                </header>
                {(isAdmin || username === comment.author) && (
                  <Button
                    onClick={() => handleDeleteComment(comment.comment_id)}
                    sx={{ padding: '0.25rem', height: '2.5rem'}}
                  >
                                  Remove Comment
                  </Button>
                )}
              </span>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </>
    </div>
  )
}
