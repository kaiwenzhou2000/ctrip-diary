import React from 'react'
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native'

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

const DATA = generateMockData(20)
console.log(DATA)

type ItemProps = { title: string }

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
)

const WaterFall = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={{ display: 'flex', justifyContent: 'center' }}
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </SafeAreaView>
  )
}

const stylesConstant = {
  itemSpacing: 8,
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
    height: 100,
  },
  title: {
    fontSize: 16,
  },
})

export default WaterFall
