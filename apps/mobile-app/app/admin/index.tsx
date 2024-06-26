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
  AvatarImage,
} from '@gluestack-ui/themed'
import { useAuth } from '@/components/authContext'
import { getUserItem } from '@/app/api/user'
import { AntDesign } from '@expo/vector-icons'
import WaterFall from '../../components/WaterFall'
import { getCurUserTourList } from '../api/tour'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Detail from '../detail'
import Tab1 from '../tabs/(tabs)/tab1'

export default function Admin() {
  const SettingsStack = createNativeStackNavigator()
  const { userId, setUserId, setIsLoggedIn, setDataUsername } = useAuth()
  const [userInfo, setUserInfo] = useState({
    username: '',
    avatarUrl: '',
  })
  const [data, setData] = useState([])
  const [currentId, setCurrentId] = useState('')

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await getUserItem(userId)
      setUserInfo(res.data)
    }
    if (userId) {
      getUserInfo()
    }

    getCurUserTourList(userId).then(({ data }) => {
      setData(() => {
        return data.map((item) => {
          return {
            id: item._id,
            title: item.title,
            avatar: item.avatarUrl,
            username: item.username,
            cover: item.coverUrl,
            state: item.state,
          }
        })
      })
    })
  }, [userId])

  // 退出登录
  const userLogout = () => {
    setIsLoggedIn(false)
    setUserId('')
    setDataUsername('')
  }

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="我的"
        component={({ navigation }) => (
          <ScrollView flex={1}>
            <Card p="$6" borderRadius="$lg" m="$3">
              <Box flexDirection="row" justifyContent="space-between">
                <Box flexDirection="row" justifyContent="flex-start" alignItems="center">
                  <Avatar mr="$4" bgColor="$indigo600">
                    <AvatarFallbackText fontFamily="$heading">RC</AvatarFallbackText>
                    {userInfo.avatarUrl ? (
                      <AvatarImage
                        alt=""
                        source={{
                          uri: userInfo.avatarUrl,
                        }}
                      />
                    ) : null}
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
              {/* <Text>发布的游记内容？</Text> */}
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
                <WaterFall
                  data={data}
                  onPress={({ id, state }) => {
                    setCurrentId(id)
                    switch (state) {
                      case 'Approved':
                        navigation.navigate('Details')
                        break
                      case 'Rejected':
                        navigation.navigate('Tab1')
                        break
                      case 'Pending review':
                        navigation.navigate('Details')
                        break
                      default:
                        break
                    }
                  }}
                />
              </Box>
            </Card>
          </ScrollView>
        )}
      />
      <SettingsStack.Screen name="Details" component={() => Detail({ id: currentId })} />
      <SettingsStack.Screen name="Tab1" component={() => Tab1({ id: currentId })} />
    </SettingsStack.Navigator>
  )
}
