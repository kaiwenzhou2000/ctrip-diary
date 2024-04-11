import React from 'react'
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native'
import { WaterFallItem } from '../types'
import { Badge, BadgeText } from '@gluestack-ui/themed'

const Item = ({
  title,
  avatar,
  username,
  cover,
  id,
  state,
  onPress,
}: WaterFallItem & {
  onPress: (data: WaterFallItem) => void
}) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress({ title, avatar, username, cover, id, state })}
    >
      <View>
        <Image style={styles.cover} source={{ uri: cover }} resizeMode="cover" />
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <View style={styles.userContainer}>
          <View style={styles.userAvator}>
            <Image style={styles.userAvatorLogo} source={{ uri: avatar }} />
          </View>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.star}>{getState(state)}</View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const getState = (state) => {
  switch (state) {
    case 'Pending review':
      return (
        <Badge size="md" variant="solid" borderRadius="$none" action="warning">
          <BadgeText>审核中</BadgeText>
        </Badge>
      )
    case 'Approved':
      return <></>
    case 'Rejected':
      return (
        <Badge size="md" variant="solid" borderRadius="$none" action="error">
          <BadgeText>审核失败</BadgeText>
        </Badge>
      )
  }
}

const WaterFall = (props: {
  data: WaterFallItem[]
  onEndReached: () => void
  onPress: (data: WaterFallItem) => void
}) => {
  const { data, onEndReached, onPress } = props

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={{ display: 'flex', justifyContent: 'center' }}
        data={data}
        renderItem={({ item }) => <Item {...item} onPress={onPress} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onEndReached={onEndReached}
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
    // width: '95%',
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
    backgroundColor: '#FCFCFC',
    margin: stylesConstant.itemSpacing,
    width: '48%',
    height: 230,
    display: 'flex',
    borderRadius: 5,
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginLeft: 5,
    marginRight: 5,
  },
  userAvator: {
    height: 20,
    width: 20,
  },
  userAvatorLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  username: {
    marginLeft: 5,
    color: '#BAB8B9',
    fontSize: 12,
  },
  star: { marginLeft: 20 },
  cover: {
    height: 150,
    width: '100%',
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    height: 35,
    marginLeft: 5,
    marginRight: 5,
  },
})

export default WaterFall
