import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, ScrollView, SafeAreaView } from 'react-native'
import PagerView from 'react-native-pager-view'

export default function MyPager() {
  const [currentPage, setCurrentPage] = useState(0)

  return (
    <SafeAreaView>
      <ScrollView horizontal={false}>
        <View style={styles.wrapper}>
          <View style={styles.imageContainer}>
            <PagerView
              style={styles.container}
              initialPage={0}
              onPageSelected={(event) => {
                setCurrentPage(event.nativeEvent.position)
              }}
            >
              <View style={styles.page} key="1">
                <Image
                  style={styles.img}
                  source={require('../../assets/images/1040g0k0310r1ajkl6g005pg0d4b1hiaa1v8r550!nc_n_webp_mw_1.webp')}
                />
              </View>
              <View style={styles.page} key="2">
                <Text>Second page</Text>
              </View>
              <View style={styles.page} key="3">
                <Text>Third page</Text>
              </View>
            </PagerView>
          </View>

          <View style={styles.pagination}>
            {[0, 1, 2].map((index) => (
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
              标题
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
              {'内容'.repeat(1001)}
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
              编辑于 04-10
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
    backgroundColor: 'blue',
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
