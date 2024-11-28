import { useEffect, useState } from 'react'
import { useCodeEnvironment } from '../../../../providers'
import axios from 'axios'
import { Comment } from '../../../../types/problem/comment.type'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'

type CommentsSectionProps = {
    commentClassName: string
}

export const CommentsSection = ({ commentClassName }: CommentsSectionProps) => {
  const { problem } = useCodeEnvironment()
  const [comments, setComments] = useState<Comment[]>([])
  const problemId = problem.problemId

  const handleDeleteComment = async(commentId: string) => {
    try {
      await axios.delete(`http://localhost:8080/problems/${problemId}/comments/${commentId}`)
      setComments((prevComments) => prevComments.filter((comment) => comment.comment_id !== commentId))
      toast.info(`Comment ${commentId} deleted successfully.`)
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error)
    }
  }

  useEffect(() => {
    const fetchComments = async() => {
      try {
        const response = await axios.get(`http://localhost:8080/problems/${problemId}/comments`)
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
                <header className='header'>{comment.author}</header>
                <Button
                  onClick={() => handleDeleteComment(comment.comment_id)}
                  sx={{ padding: '0.25rem', height: '2.5rem'}}
                >
                  Remove Comment
                </Button>
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
