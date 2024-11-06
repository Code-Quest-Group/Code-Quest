import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel, Typography } from '@mui/material'
import axios from 'axios'
import clsx from 'clsx'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLayout, useUser } from '../../../providers'
import { Button, Seperator } from '../../utils'
import classes from './sign-in.module.scss'

const SignIn = () => {
  const { showNavbar } = useLayout()
  const { setUserId, setToken, setUsername } = useUser()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'signIn' | 'register'>('signIn')
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (activeTab === 'signIn') {
      const emailOrUsername = formData.get('emailOrUsername')
      const password = formData.get('password')
      setUsername(String(emailOrUsername)) // TODO: update this so that it fetches username beforehand
      login(String(emailOrUsername), String(password))
      return

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
          const newUserId: string = response.data
          setUserId(newUserId)
          setUsername(String(username))

          login(String(username), String(password))
        }

      } catch (error) {
        toast.error('There was an error while registering, please try again!')
        console.log(error)
      }
    }
  }

  const login = async(usernameOrEmail: string, password: string) => {
    const payload = {
      password,
      username_or_email: usernameOrEmail,
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/login', payload)
      const token: string = response.data.data.token
      setToken(token)
      toast.info('Logged in')
      navigate('/problems')

    } catch (error) {
      toast.error('There was an error while logging in, please try again!')
      console.log(error)
    }
  }

  return (
    <main className={clsx('container', { 'full-height': !showNavbar })}>
      <div className={classes.signInPageContainer}>
        <div className={classes.contentCard}>
          <div className={classes.tabs}>
            <button
              className={clsx({[classes.selected]: activeTab === 'signIn'})}
              onClick={() => setActiveTab('signIn')}
            >
              Sign In
            </button>
            <Seperator />
            <button
              className={clsx({[classes.selected]: activeTab === 'register'})}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          <section className={classes.formContainer}>
            {activeTab === 'signIn' ? (
              <form onSubmit={handleSubmit}>
                <FormControl sx={{ m: 1 }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-email" required>Username or Email</InputLabel>
                  <FilledInput name='emailOrUsername' required />
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-password" required>Password</InputLabel>
                  <FilledInput
                    name='password'
                    required
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Button type="submit">
                  <Typography variant="button" style={{ textTransform: 'none' }}>
                    Sign In
                  </Typography>
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <FormControl sx={{ m: 1 }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-username" required>Username</InputLabel>
                  <FilledInput name='username'required />
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-password" required>Password</InputLabel>
                  <FilledInput
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
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
                  <FilledInput name='email' type="email" required />
                </FormControl>
                <Button type="submit">
                  <Typography variant="button" style={{ textTransform: 'none' }}>
                    Register
                  </Typography>
                </Button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default SignIn
