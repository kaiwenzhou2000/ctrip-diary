import React from 'react'
import { Center, View } from '@gluestack-ui/themed'
import Login from '@/app/login'
import Admin from '@/app/admin'
import { useAuth } from '@/components/authContext'

export default function Tab2() {
  // const [isLogin, setIsLogin] = useState(false)
  const { isLoggedIn } = useAuth()
  // const loginSuccess = () => {
  //   setIsLoggedIn(true)
  // }
  return (
    <>
      {isLoggedIn ? (
        <View flex={1}>
          <Admin />
        </View>
      ) : (
        <Center flex={1}>
          <Login />
        </Center>
      )}
    </>
  )
}
