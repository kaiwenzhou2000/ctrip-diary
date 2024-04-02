import React, { useState, useRef } from 'react'
import {
  Text,
  View,
  Textarea,
  TextareaInput,
  HStack,
  Card,
  Button,
  ButtonText,
} from '@gluestack-ui/themed'
import { TouchableOpacity, StyleSheet, ScrollView, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { UploadMedia } from '@/components/uploadMedia'
import { Video, ResizeMode } from 'expo-av'
// import { Platform } from 'react-native'

export default function Publish() {
  const videoRef = useRef(null)
  const [hasVideo, setHasVideo] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{ localUri: string } | null>(null)

  const handleSelectVideo = async () => {
    const videos = await UploadMedia({ mediaTypes: 'Videos' })
    if (videos.length > 0) {
      const { uri } = videos[0]
      setSelectedVideo({ localUri: uri })
      setHasVideo(true)
    }
  }

  const publishTour = () => {}

  // const videoShow = !hasVideo ? (
  //   <>
  //     <Icon name="add-a-photo" size={30} />
  //     <Text>上传视频</Text>
  //   </>
  // ) : Platform.OS === 'web' ? (
  //   <video src={selectedVideo?.localUri} controls style={{ width: '100%', height: 'auto' }} />
  // ) : (
  //   <Video
  //     source={{ uri: selectedVideo?.localUri }}
  //     ref={videoRef}
  //     onBuffer={onBuffer}
  //     onError={videoError}
  //     style={{ width: '100%', height: 300 }}
  //   />
  // )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBanner}>
        <Text>发文方向tips:旅行、探亲、见家人、美食...</Text>
      </View>
      <Card>
        <View>
          <HStack style={styles.uploadContainer}>
            <TouchableOpacity style={[styles.upload, styles.uploadBtn]}>
              <Icon name="collections" size={30} />
              <Text>选择图片</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.upload, styles.uploadVideo]}
              onPress={handleSelectVideo}
            >
              {!hasVideo ? (
                <>
                  <Icon name="add-a-photo" size={30} />
                  <Text>上传视频</Text>
                </>
              ) : (
                <Video
                  ref={videoRef}
                  source={{ uri: selectedVideo?.localUri || '' }}
                  rate={1.0}
                  volume={0}
                  isMuted={false}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay
                  isLooping
                  useNativeControls
                  style={styles.uploadVideo}
                />
              )}
            </TouchableOpacity>
          </HStack>
        </View>
        <Text>填写标题</Text>
        <Textarea size="md" isReadOnly={false} isInvalid={false} isDisabled={false} w="$64">
          <TextareaInput placeholder="Your text goes here..." />
        </Textarea>
      </Card>

      <Pressable style={styles.publishContainer}>
        <Button size="sm" bgColor="$indigo600" onPress={publishTour}>
          <ButtonText color="$white">发布</ButtonText>
        </Button>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBanner: {
    padding: 10,
    backgroundColor: '#e3f2fd',
  },
  uploadContainer: {
    paddingRight: 20,
    paddingBottom: 10,
  },
  upload: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBtn: {
    marginRight: 10,
    borderColor: '#EOEOEO',
  },
  uploadVideo: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishContainer: {
    margin: 10,
    flex: 1,
    flexDirection: 'row',
  },
})
