import clsx from 'clsx'
import classes from './tags-list.module.scss'

type TagsListProps = {
    tags: string[]
    className?: string
}

export const TagsList = ({ tags, className }: TagsListProps) => {
  return (
    <div className={clsx(classes.tagsContainer, className)}>
      {tags.length > 0 ? (
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      ) : (
        <p>No tags available.</p>
      )}
    </div>
  )
}
