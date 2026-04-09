import { createContext, useEffect, useState } from 'react';
import * as UserService from '../utils/UserService';

export const UserContext = createContext({})

export const UserProvider = ({ children }) => {
  const [push_token, setPushToken] = useState('');
  const [user, setUser] = useState();

  useEffect(() => {
    const init = async () => {
      console.log('loading token')
      if (await UserService.getToken()) {
        console.log('loading user')
        await reload()
      }
    }
    init()
  }, []);

  const reload = async () => {
    try {
      const result = await UserService.load()
      //if (result.code === 'Unauthorized') {
      //  await localStorage.removeItem('access_token')
      //} else 
      if (result.id > 0) {
        setUser(result)
      } else {
        console.log('login error', result)
      }
    } catch (ex) {
      console.log('login exception', ex)
    }
  }

  const handleLoginResult = async (response) => {
    const data = await response.json()
    if (data.status === 'error') {
      alert({
        type: 'error',
        text1: 'Нэвтэрч чадсангүй',
        text2: data.message,
      })
      return false
    }

    await localStorage.setItem('access_token', data.access_token)
    await localStorage.setItem('refresh_token', data.refresh_token)
    const user = await UserService.load()
    setPushToken(push_token)
    setUser(user)

    return true
  }

  const login = async (email, password, push_token) => {

    try {
      const data = await UserService.logIn({ email, password, push_token })
      return handleLoginResult(data)
    } catch (e) {
      alert('Нэвтэрч чадсангүй. Сервертэй харьцахад алдаа гарлаа.')
    }
    return false
  }

  const logout = async () => {
    await localStorage.removeItem('access_token')
    await localStorage.removeItem('refresh_token')
    setUser(undefined)
  }

  return <UserContext.Provider value={{ push_token, user, logout, login, reload }}>
    {children}
  </UserContext.Provider>
}