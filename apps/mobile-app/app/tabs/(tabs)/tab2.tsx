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
      {isLogin ? (
        <View flex={1}>
          <Admin />
        </View>
      ) : (
        <Center flex={1}>
          <Login loginSuccess={loginSuccess} />
        </Center>
      )}
    </>
  )
}
