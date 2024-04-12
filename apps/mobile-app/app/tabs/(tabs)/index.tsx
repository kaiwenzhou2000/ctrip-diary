import React, { useEffect, useState } from 'react'
import { Center } from '@gluestack-ui/themed'
import { WaterFall } from '../../../components'
import { WaterFallItem } from '../../../types'
import { getAllUserTourList } from '../../api/tour'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Detail from '../../detail'
// import { NavigationContainer } from '@react-navigation/native'
// import { createStackNavigator } from '@react-navigation/stack'
// import { useNavigation } from '@react-navigation/native'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'

export default function Home() {
  const SettingsStack = createNativeStackNavigator()
  // const Stack = createStackNavigator()
  // const navigation = useNavigation()
  const [data, setData] = useState<WaterFallItem[]>([])
  const [current, setCurrent] = useState(1)
  const [currentId, setCurrentId] = useState<string>('')

  const fetchData = () => {
    getAllUserTourList({ current, pageSize: 10 }).then(({ data: d }) => {
      console.log(d, 'getAllUserTourList')
      if (d.length != 0) {
        setData(() => {
          console.log(data, d, 'setData')
          return [
            ...data,
            ...d.map((item) => {
              return {
                id: item._id,
                title: item.title,
                avatar: item.avatarUrl,
                username: item.username,
                cover: item.coverUrl,
              }
            }),
          ]
        })
        setCurrent((prev) => prev + 1)
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="首页"
        component={({ navigation }) => (
          <Center style={{ backgroundColor: '#F6F6F6' }} flex={1}>
            <WaterFall
              data={data}
              onEndReached={fetchData}
              onPress={({ id }) => {
                setCurrentId(id)
                navigation.navigate('Details')
              }}
            />
          </Center>
        )}
      />
      <SettingsStack.Screen name="Details" component={() => Detail({ id: currentId })} />
    </SettingsStack.Navigator>
  )
}
