import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Text, Center } from '@gluestack-ui/themed'
import { useAuth } from '@/components/authContext'
import Publish from '@/app/publish'
import { Link } from 'expo-router'

export default function Tabs1({ id }: { id: string }) {
  const { isLoggedIn } = useAuth()
  return (
    <>
      {isLoggedIn ? (
        <Publish id={id} />
      ) : (
        <Center flex={1}>
          <Link href="/login/" asChild>
            <Pressable>
              <Text style={styles.loginBtn}>请先登录</Text>
            </Pressable>
          </Link>
        </Center>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  loginBtn: {
    textAlign: 'center',
    fontSize: 20,
    color: '#06C',
  },
})
