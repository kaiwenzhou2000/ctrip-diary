import React from 'react'
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image } from 'react-native'

function generateMockData(count: number) {
  const mockData = []
  for (let i = 0; i < count; i++) {
    mockData.push({
      id: `${i + 1}`,
      title: `Mock Item ${i + 1}`,
    })
  }
  return mockData
}

const fetchMoreData = () => generateMockData(10)

const DATA = generateMockData(20)
console.log(DATA)

type ItemProps = { title: string }

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Image
      style={styles.tinyLogo}
      source={require('../assets/images/1040g0k0310r1ajkl6g005pg0d4b1hiaa1v8r550!nc_n_webp_mw_1.webp')}
      resizeMode="cover"
    />
    <Text style={styles.title}>{title}</Text>
    <div style={styles.userContainer}>
      <div style={styles.userAvator}></div>
      <div style={styles.username}></div>
      <div style={styles.star}></div>
    </div>
  </View>
)

const WaterFall = () => {
  const [data, setData] = React.useState(DATA) // Assume DATA is your initial data

  const loadMoreData = () => {
    // Fetch more data here and append it to the existing data
    // For example:
    const moreData = fetchMoreData() // Replace this with your actual data fetching logic
    setData([...data, ...moreData])
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={{ display: 'flex', justifyContent: 'center' }}
        data={data}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onEndReached={loadMoreData} // Load more data when the list reaches the end
        onEndReachedThreshold={0.5} // Trigger the onEndReached callback when the end of the content is within half the visible length of the list. This value is a ratio, not pixel.
      />
    </SafeAreaView>
  )
}

const stylesConstant = {
  itemSpacing: 4,
  itemWidth: '',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 0,
    width: '95%',
  },
  contentContainerStyle: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  list: {
    width: '100%',
  },
  item: {
    backgroundColor: '#f9c2ff',
    margin: stylesConstant.itemSpacing,
    width: '45%',
    height: 200,
  },
  userContainer: {
    display: 'flex',
  },
  userAvator: {},
  username: {},
  star: {},
  tinyLogo: {
    height: 150,
    width: '100%',
  },
  title: {
    fontSize: 14,
  },
})

export default WaterFall
