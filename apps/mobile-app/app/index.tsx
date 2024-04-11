import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'
// import { router } from 'expo-router'
import Login from './login'

export default function Home() {
  const fadeOutAnim = useRef(new Animated.Value(1)).current // 当前页面的透明度渐隐
  const fadeInAnim = useRef(new Animated.Value(0)).current // Login页面的透明度渐现

  useEffect(() => {
    // 开始执行渐变消失动画
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: true,
    }).start()
    setTimeout(() => {
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start()
    }, 3000)
  }, [fadeOutAnim, fadeInAnim])

  return (
    <>
      <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
        <Animated.Image
          source={require('@/assets/images/home.jpeg')}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>
      <Login type="home" opacity={fadeInAnim} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#FFF',
  },
  image: {
    flex: 1,
  },
})
