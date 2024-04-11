import React, { useEffect, useState } from 'react'
import { Center } from '@gluestack-ui/themed'
import { WaterFall } from '../../../components'
import { WaterFallItem } from '../../../types'
import { getAllUserTourList } from '../../api/tour'
// import { useNavigation } from '@react-navigation/native'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'

export default function Home() {
  // const Stack = createNativeStackNavigator()
  // const navigation = useNavigation()
  const [data, setData] = useState<WaterFallItem[]>([])
  const [current, setCurrent] = useState(1)

  const onPress = (data) => {
    console.log(data)
  }

  const fetchData = () => {
    getAllUserTourList({ current, pageSize: 10 }).then(({ data: d }) => {
      if (d.length != 0) {
        setData(() => {
          return [
            ...data,
            ...d.map((item) => {
              console.log(item)
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

  // const Detail = () => {
  //   return <div>123</div>
  // }

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
    <Center style={{ backgroundColor: '#F6F6F6' }} flex={1}>
      <WaterFall data={data} onEndReached={fetchData} onPress={onPress} />
    </Center>
  )
}
