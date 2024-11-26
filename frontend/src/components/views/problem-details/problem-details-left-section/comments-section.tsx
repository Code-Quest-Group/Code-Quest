import { useEffect, useState } from 'react'
import { useCodeEnvironment } from '../../../../providers'
import axios from 'axios'
import { Comment } from '../../../../types/problem/comment.type'

type CommentsSectionProps = {
    commentClassName: string
}

export const CommentsSection = ({ commentClassName }: CommentsSectionProps) => {
  const { problem } = useCodeEnvironment()
  const [comments, setComments] = useState<Comment[]>([])
  const problemId = problem.problemId

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
              <header className='header'>{comment.author}</header>
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
