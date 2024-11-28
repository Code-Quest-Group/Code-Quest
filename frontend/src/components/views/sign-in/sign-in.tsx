import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Typography,
  Dialog,
  DialogContent
} from '@mui/material'
import axios from 'axios'
import clsx from 'clsx'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useUser } from '../../../providers'
import { Button, Seperator } from '../../utils'
import classes from './sign-in.module.scss'

type SignInModalProps = {
  open: boolean
  onClose: () => void
}

export const SignInModal = ({ open, onClose }: SignInModalProps) => {
  const { setToken, setUsername, setIsAdmin, setRefreshToken } = useUser()

  const [activeTab, setActiveTab] = useState<'signIn' | 'register'>('signIn')
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault()

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (activeTab === 'signIn') {
      const emailOrUsername = formData.get('emailOrUsername')
      const password = formData.get('password')
      login(String(emailOrUsername), String(password))
    } else {
      const username = formData.get('username')
      const password = formData.get('password')
      const payload = {
        email: formData.get('email'),
        username,
        password,
      }

      try {
        const response = await axios.post('http://localhost:8080/auth/register', payload)

        if (response.status === 201) {
          login(String(username), String(password))
        }
      } catch (error) {
        toast.error('There was an error while registering, please try again!')
        console.log(error)
      }
    }
  }

  const login = async(username: string, password: string) => {
    const payload = { password, username_or_email: username }

    try {
      const response = await axios.post('http://localhost:8080/auth/login', payload)
      const userData = response.data.data
      console.log(userData)
      setToken(userData.token)
      setUsername(userData.username)
      setIsAdmin(userData.role === 'ADMIN')
      setRefreshToken(userData.refresh_token)
      toast.info('Logged in')
      onClose()
    } catch (error) {
      toast.error('There was an error while logging in, please try again!')
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} sx={{ marginTop: '3rem'}}>
      <div className={classes.contentCard}>
        <DialogContent className={classes.content}>
          <div className={classes.tabs}>
            <button
              className={clsx({ [classes.selected]: activeTab === 'signIn' })}
              onClick={() => setActiveTab('signIn')}
            >
              Sign In
            </button>
            <Seperator />
            <button
              className={clsx({ [classes.selected]: activeTab === 'register' })}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
          <form onSubmit={handleSubmit} className={classes.formContainer}>
            {activeTab === 'signIn' ? (
              <>
                <FormControl sx={{ m: 1 }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-email" required>Username or Email</InputLabel>
                  <FilledInput name="emailOrUsername" required />
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-password" required>Password</InputLabel>
                  <FilledInput
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'hide the password' : 'display the password'}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </>
            ) : (
              <>
                <FormControl sx={{ m: 1 }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-username" required>Username</InputLabel>
                  <FilledInput name="username" required />
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-password" required>Password</InputLabel>
                  <FilledInput
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'hide the password' : 'display the password'}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-email" required>Email</InputLabel>
                  <FilledInput name="email" type="email" required />
                </FormControl>
              </>
            )}
            <Button type="submit">
              <Typography variant="button" style={{ textTransform: 'none' }}>
                {activeTab === 'signIn' ? 'Sign In' : 'Register'}
              </Typography>
            </Button>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  )
}
