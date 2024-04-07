import React, { useEffect, useState } from 'react'
import {
  Avatar,
  AvatarFallbackText,
  Box,
  Card,
  Heading,
  ScrollView,
  VStack,
  Text,
  Image,
  AvatarImage,
} from '@gluestack-ui/themed'
import { useAuth } from '@/components/authContext'
import { getUserItem } from '@/app/api/user'
import { AntDesign } from '@expo/vector-icons'
export default function Admin() {
  const { userId, setUserId, setIsLoggedIn } = useAuth()
  const [userInfo, setUserInfo] = useState({
    username: '',
    avatarUrl: '',
  })
  useEffect(() => {
    const getUserInfo = async () => {
      const res = await getUserItem(userId)
      setUserInfo(res.data)
    }
    getUserInfo()
  }, [userId])

  // 退出登录
  const userLogout = () => {
    setIsLoggedIn(false)
    setUserId('')
  }

  return (
    <>
      <ScrollView flex={1}>
        <Card p="$6" borderRadius="$lg" m="$3">
          <Box flexDirection="row" justifyContent="space-between">
            <Box flexDirection="row" justifyContent="flex-start" alignItems="center">
              <Avatar mr="$4" bgColor="$indigo600">
                <AvatarFallbackText fontFamily="$heading">RC</AvatarFallbackText>
                {/* 获取用户头像 */}
                <AvatarImage
                  alt=""
                  source={{
                    uri: userInfo.avatarUrl,
                  }}
                />
              </Avatar>
              <VStack>
                <Heading size="md" fontFamily="$heading" mb="$1">
                  {userInfo.username}
                </Heading>
                <Text size="sm" fontFamily="$heading">
                  lina_chen02@163.com
                </Text>
              </VStack>
            </Box>
            <AntDesign name="logout" size={18} color="black" onPress={userLogout} />
          </Box>
          <Box
            mt="$5"
            mb="$1"
            sx={{
              flexDirection: 'row',
              '@sm': {
                my: '$3',
                flexDirection: 'row',
              },
            }}
          >
            <VStack
              alignItems="center"
              sx={{
                py: '$2',
                pr: '$2',
                '@sm': {
                  flex: 1,
                  pb: '$0',
                  borderRightWidth: 1,
                  borderColor: '$backgroundLight300',
                  _dark: {
                    borderRightColor: '$backgroundDark800',
                  },
                },
              }}
            >
              <Heading size="xs" fontFamily="$heading">
                15
              </Heading>
              <Text size="xs">关注</Text>
            </VStack>
            <VStack
              alignItems="center"
              sx={{
                py: '$2',
                pr: '$2',
                '@sm': {
                  flex: 1,
                  py: '$0',
                  borderRightWidth: 1,
                  borderColor: '$backgroundLight300',
                  _dark: {
                    borderRightColor: '$backgroundDark800',
                  },
                },
              }}
            >
              <Heading size="xs" fontFamily="$heading">
                20
              </Heading>
              <Text size="xs">粉丝</Text>
            </VStack>
            <VStack
              alignItems="center"
              sx={{
                py: '$2',
                '@sm': {
                  flex: 1,
                  pt: '$0',
                },
              }}
            >
              <Heading size="xs" fontFamily="$heading">
                10
              </Heading>
              <Text size="xs">获赞与收藏</Text>
            </VStack>
          </Box>
        </Card>
        <Card p="$6" borderRadius="$lg" mx="$3">
          <Text>发布的游记内容？</Text>
          <Box
            mb="$5"
            sx={{
              flexDirection: 'column',
              '@sm': {
                mb: '$6',
                flexDirection: 'column',
              },
            }}
          >
            <Image
              mb="$3"
              $xs-borderRadius="$md"
              sx={{
                width: '$full',
                height: 200,
                '@sm': {
                  mb: '$0',
                  mr: '$3',
                  width: 150,
                  height: 154,
                },
              }}
              source={{
                uri: 'https://images.unsplash.com/photo-1592089416462-2b0cb7da8379?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              }}
              alt=""
            />
            <Image
              mb="$3"
              alt=""
              $xs-borderRadius="$md"
              sx={{
                width: '$full',
                height: 200,
                '@sm': {
                  width: 150,
                  height: 154,
                },
              }}
              source={{
                uri: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?q=80&w=2425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              }}
            />
            <Image
              alt=""
              $xs-borderRadius="$md"
              sx={{
                width: '$full',
                height: 200,
                '@sm': {
                  width: 150,
                  height: 154,
                },
              }}
              source={{
                uri: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?q=80&w=2425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              }}
            />
          </Box>
        </Card>
      </ScrollView>
    </>
  )
}
