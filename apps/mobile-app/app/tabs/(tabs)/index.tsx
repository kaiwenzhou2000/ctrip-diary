import React, { useState } from 'react'
import { Center } from '@gluestack-ui/themed'
import { WaterFall } from '../../../components'
import { WaterFallItem } from '../../../types'
// import { useNavigation } from '@react-navigation/native'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'

export default function Home() {
  // const Stack = createNativeStackNavigator()
  // const navigation = useNavigation()
  const [data, setData] = useState<WaterFallItem[]>(() => {
    return generateMockData(10)
  })

  function generateMockData(count: number): WaterFallItem[] {
    const mockData = []
    for (let i = 0; i < count; i++) {
      mockData.push({
        id: `${i + 1}`,
        title: `123123123123123123123123123123123123122313Mock Item ${i + 1}`,
        avatar: '../assets/images/1040g0k0310r1ajkl6g005pg0d4b1hiaa1v8r550!nc_n_webp_mw_1.webp',
        username: 'meredith',
        cover: '../assets/images/1040g0k0310r1ajkl6g005pg0d4b1hiaa1v8r550!nc_n_webp_mw_1.webp',
      })
    }
    return mockData
  }

  const loadMoreData = () => {
    setTimeout(() => {
      const moreData = generateMockData(10)
      setData([...data, ...moreData])
    }, 1000)
  }

  const onPress = (id: string) => {
    console.log(id)
    // navigation.navigate('detail')
  }

  // const Detail = () => {
  //   return <div>123</div>
  // }

  console.log(123123)

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
      <WaterFall data={data} onEndReached={loadMoreData} onPress={onPress} />
    </Center>
  )
}
