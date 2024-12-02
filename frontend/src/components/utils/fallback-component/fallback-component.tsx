import { FC } from 'react'
import { FallbackProps } from 'react-error-boundary'

/* eslint-disable react/prop-types */
export const FallbackComponent: FC<FallbackProps> = ({ error }) => (
  <div className='container'>
    <p>Something went wrong: {error.message}</p>
  </div>
)
