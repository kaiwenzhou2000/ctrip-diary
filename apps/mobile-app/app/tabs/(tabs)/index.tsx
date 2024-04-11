import React, { useEffect } from 'react'
import { Center } from '@gluestack-ui/themed'
// import { WaterFall } from '../../../components'
// import { WaterFallItem } from '../../../types'
import { getAllUserTourList } from '../../api/tour'
// import { Stack } from 'expo-router'
// import { View } from 'react-native'
import Detail from '../../detail/detail'
// import { useNavigation } from '@react-navigation/native'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'

export default function Home() {
  // const Stack = createNativeStackNavigator()
  // const navigation = useNavigation()
  // const [data, setData] = useState<WaterFallItem[]>(() => {
  //   return []
  // })

  // const loadMoreData = () => {
  //   // setTimeout(() => {
  //   //   const moreData = generateMockData(10)
  //   //   setData([...data, ...moreData])
  //   // }, 1000)
  // }

  // const onPress = (id: string) => {
  //   console.log(id)
  //   // navigation.navigate('detail')
  // }

  useEffect(() => {
    getAllUserTourList({ pageSize: 10, current: 1 }).then(({ data }) => {
      const res = data.map((item) => {
        return {
          id: item._id,
          cover: item.coverUrl,
          // item.avatar = item.avatar
          username: item.username,
          title: item.title,
        }
      })
      setData(res)
    })
    // console.log(res)
  }, [])

  return (
    // <Stack.Navigator>
    //   <Stack.Screen
    //     name="waterfall"
    //     component={() => (
    //       <Center style={{ backgroundColor: '#F6F6F6' }} flex={1}>
    //         <WaterFall data={data} onEndReached={loadMoreData} onPress={onPress} />
    //       </Center>
    //     )}
    //   />
    //   <Stack.Screen name="detail" component={Detail} />
    // </Stack.Navigator>
    // <View>
    //   <Stack.Screen name="detail" />
    // </View>

    <Center style={{ backgroundColor: '#F6F6F6' }}>
      {/* <WaterFall data={data} onEndReached={loadMoreData} onPress={onPress} /> */}
      <Detail />
    </Center>
  )
}
