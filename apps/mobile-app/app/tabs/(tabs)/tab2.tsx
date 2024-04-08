import React from 'react'
import { Center, View } from '@gluestack-ui/themed'
import Login from '@/app/login'
import Admin from '@/app/admin'
import { useAuth } from '@/components/authContext'

export default function Tab2() {
  const { isLoggedIn } = useAuth()
  return (
    <>
      {isLoggedIn ? (
        <View flex={1}>
          <Admin />
        </View>
      ) : (
        <Center flex={1}>
          <Login type="tab2" />
        </Center>
      )}
    </>
  )
}
