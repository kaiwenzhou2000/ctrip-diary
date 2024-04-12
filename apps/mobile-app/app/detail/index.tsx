import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, ScrollView, SafeAreaView } from 'react-native'
import PagerView from 'react-native-pager-view'
import { getTourItem } from '../api/tour'

export default function Index(props: { id: string }) {
  const { id } = props
  const [currentPage, setCurrentPage] = useState(0)
  const [urls, setUrls] = useState<string[]>([])
  const [finish, setFinish] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    getTourItem(id)
      .then(({ data }) => {
        console.log(data, 'getTourItem')
        setUrls(() => {
          return data.imgUrls
        })
        setTitle(data.title)
        setContent(data.description)
        setTime(data.create_at)
      })
      .then(() => {
        setFinish(true)
      })
  }, [])

  const getTime = (time) => {
    const date = new Date(time)
    const month = date.getMonth() + 1 // getMonth() 返回的月份从0开始
    const day = date.getDate()
    return `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  }

  return (
    <SafeAreaView>
      <ScrollView horizontal={false}>
        <View style={styles.wrapper}>
          <View style={styles.imageContainer}>
            {finish && (
              <PagerView
                style={styles.container}
                initialPage={0}
                onPageSelected={(event) => {
                  setCurrentPage(event.nativeEvent.position)
                }}
              >
                {urls.map((item, index) => {
                  return (
                    <View style={styles.page} key={index}>
                      <Image style={styles.img} source={{ uri: item }} />
                    </View>
                  )
                })}
              </PagerView>
            )}
          </View>

          <View style={styles.pagination}>
            {Array.from({ length: urls.length }, (_, index) => index).map((index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === currentPage ? '#FF2344' : '#CCC' },
                ]}
              />
            ))}
          </View>
          <View style={styles.content}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '500',
                marginTop: 20,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '300',
                marginTop: 20,
                marginLeft: 10,
                marginRight: 10,
                // minHeight: 300,
              }}
            >
              {content}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '300',
                color: '#7E7E7E',
                marginTop: 20,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              编辑于 {getTime(time)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    // flexDirection: 'column',
    alignContent: 'flex-end',
  },
  imageContainer: {
    height: 560,
    width: 400,
    // flex: 1,
    // backgroundColor: 'blue',
    // marginBottom: 20,
  },
  container: {
    // flex: 1,
    // backgroundColor: 'blue',
    // width: 380,
    height: 540,
    // marginBottom: 20,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    // height: 300,
  },
  img: {
    backgroundColor: 'blue',
    flex: 1,
    alignSelf: 'center',
    width: 380,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
})
