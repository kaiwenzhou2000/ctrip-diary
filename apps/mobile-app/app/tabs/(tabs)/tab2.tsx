import React, { useState } from 'react'
import { Center, View } from '@gluestack-ui/themed'
import Login from '@/app/login'
import Admin from '@/app/admin'

export default function Tab2() {
  const [isLogin, setIsLogin] = useState(false)
  const loginSuccess = () => {
    setIsLogin(true)
  }
  return (
    <>
      {!isLogin && (
        <Center flex={1}>
          <Login loginSuccess={loginSuccess} />
        </Center>
      )}
      {isLogin && (
        <View flex={1}>
          <Admin />
        </View>
      )}
    </>
  )
}
