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
  Input,
  InputField,
  Pressable,
  Image,
  FormControl,
} from '@gluestack-ui/themed'
import { TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { UploadMedia } from '@/components/uploadMedia'
import { Video, ResizeMode } from 'expo-av'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { router } from 'expo-router'

export default function Publish() {
  const videoRef = useRef(null)
  const [hasVideo, setHasVideo] = useState(false)
  const [hasImages] = useState(false)
  const [imageList] = useState([])
  const [selectedVideo, setSelectedVideo] = useState<{ localUri: string } | null>(null)
  const handleSelectVideo = async () => {
    const videos = await UploadMedia({ allowsMultipleSelection: false, mediaTypes: 'Videos' })
    if (videos.length > 0) {
      const { uri } = videos[0]
      setSelectedVideo({ localUri: uri })
      setHasVideo(true)
    }
  }

  const publishTour = () => {
    router.push('/tabs/(tabs)/tab2')
  }

  // const [titleValid, setTitleValid] = useState(false)
  const [title, setTitle] = useState('')

  return (
    <ScrollView style={styles.scrollview} contentContainerStyle={styles.container}>
      <View>
        <View style={styles.topBanner}>
          <Text>发文方向tips:旅行、探亲、见家人、美食...</Text>
        </View>
        <Card>
          <View>
            <HStack style={styles.uploadContainer}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {!hasImages ? (
                  <TouchableOpacity style={[styles.upload, styles.uploadBtn]}>
                    <Icon name="collections" size={30} />
                    <Text>选择图片</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    {imageList.map((_img, index) => {
                      return <Image key={index} alt="" style={[styles.upload, styles.uploadBtn]} />
                    })}
                    <TouchableOpacity style={[styles.upload, styles.uploadBtn]}>
                      <Icon name="collections" size={30} />
                      <Text>选择图片</Text>
                    </TouchableOpacity>
                  </>
                )}
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
              </ScrollView>
            </HStack>
          </View>
          <FormControl isRequired={true}>
            <Input variant="underlined" size="md" ml="$2">
              <InputField placeholder="填写标题" value={title} onChangeText={setTitle} />
            </Input>
          </FormControl>
          <Textarea
            size="md"
            isInvalid={false}
            mt="$2"
            style={{ borderWidth: 0, height: textareaHeight }}
          >
            <TextareaInput placeholder="详细分享你的真实体验、实用攻略和一些小Tip，你的旅游足迹等...." />
          </Textarea>
        </Card>

        <HStack style={styles.publishContainer}>
          <View>
            <Pressable
              style={styles.saveBtn}
              onPress={() => console.log('Hello')}
              $hover-bg="$primary50"
            >
              {({ pressed }) => (
                <>
                  <FontAwesome name="save" size={18} color={pressed ? 'grey' : 'black'} />
                  <Text mt={5} color={pressed ? 'grey' : 'black'}>
                    存草稿
                  </Text>
                </>
              )}
              {/* <FontAwesome name="save" size={18} color="black" /> */}
              {/* <Text style={styles.saveText}>存草稿</Text> */}
            </Pressable>
          </View>
          <Button variant="solid" size="md" bgColor="$indigo600" width={200} onPress={publishTour}>
            <ButtonText color="$white">发布</ButtonText>
          </Button>
        </HStack>
      </View>
    </ScrollView>
  )
}

// 获取屏幕高度
const screenHeight = Dimensions.get('window').height
const textareaHeight = screenHeight / 3

const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
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
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  saveBtn: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
