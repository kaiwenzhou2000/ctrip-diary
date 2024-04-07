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
  AlertCircleIcon,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from '@gluestack-ui/themed'
import { TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { UploadMedia } from '@/components/uploadMedia'
import { Video, ResizeMode } from 'expo-av'
import FontAwesome from '@expo/vector-icons/FontAwesome'
// import { router } from 'expo-router'
import { publishTourItem } from '../api/user'

export default function Publish() {
  const videoRef = useRef(null)
  const [hasVideo, setHasVideo] = useState(false)
  const [hasImages, setHasImages] = useState(false)
  const [imageList, setImageList] = useState([])
  const [selectedVideoUri, setSelectedVideoUri] = useState<{ localUri: string } | null>(null)
  const [selectedVideo, setSelectedVideo] = useState({
    uri: '',
    type: '',
    fileName: '',
  })
  const handleSelectVideo = async () => {
    const videos = await UploadMedia({ allowsMultipleSelection: false, mediaTypes: 'Videos' })
    if (videos.length > 0) {
      setSelectedVideo(videos[0])
      const { uri } = videos[0]
      setSelectedVideoUri({ localUri: uri })
      setHasVideo(true)
    }
  }

  const handleSelectImage = async () => {
    const images = await UploadMedia({
      allowsMultipleSelection: true, // 允许选择多张图片
      mediaTypes: 'Images', // 选择的媒体类型为图片
    })

    // 检查用户是否选择了图片
    if (images.length > 0) {
      setHasImages(true)
      setImageList(images) // 更新图片列表状态
    }
  }

  const [titleValid, setTitleValid] = useState(false)
  const [title, setTitle] = useState('')
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!value) {
      setTitleValid(true)
    } else {
      setTitleValid(false)
    }
  }

  const [descriptionValid, setDescriptionValid] = useState(false)
  const [description, setDescription] = useState('')
  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    if (!value) {
      setDescriptionValid(true)
    } else {
      setDescriptionValid(false)
    }
  }

  // 发布
  // const publishTour = async () => {
  //   if (!title) {
  //     setTitleValid(true)
  //     return
  //   }
  //   if (!description) {
  //     setDescriptionValid(true)
  //     return
  //   }
  //   const formData = new FormData()
  //   const { type } = selectedVideo
  //   const filename = selectedVideoUri?.localUri.split('/').pop()
  //   formData.append('title', title)
  //   formData.append('description', description)
  //   formData.append('file', {
  //     uri: selectedVideoUri?.localUri,
  //     name: filename,
  //     type,
  //   })
  //   try {
  //     await publishTourItem(formData)
  //   } catch (e) {
  //     console.log(e)
  //   }
  //   // router.push('/tabs/(tabs)/tab2')
  // }

  const publishTour = async () => {
    if (!title || !description) {
      setTitleValid(!title)
      setDescriptionValid(!description)
      return
    }
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)

    if (selectedVideoUri) {
      formData.append('file', {
        uri: selectedVideoUri.localUri,
        type: selectedVideo.type,
        name: selectedVideo.fileName || 'video.mp4',
      })
    }

    // 处理图片
    imageList.forEach((img, index) => {
      formData.append('file', img)
    })

    try {
      const response = await fetch('http://localhost:3000/publish', {
        method: 'POST',
        body: formData,
        // 注意：当使用FormData时，不要手动设置Content-Type头部
      })
      const responseData = await response.json()
      console.log('Publish Success:', responseData)
      // 发布成功后的操作，比如跳转到其他页面
    } catch (error) {
      console.error('Publish Error:', error)
    }
  }

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
                {
                  !hasImages ? (
                    <TouchableOpacity
                      style={[styles.upload, styles.uploadBtn]}
                      onPress={handleSelectImage}
                    >
                      <Icon name="collections" size={30} />
                      <Text>选择图片</Text>
                    </TouchableOpacity>
                  ) : null // 如果已经选择了图片，则不显示"选择图片"按钮
                }
                {imageList.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img.uri }}
                    style={[styles.upload, styles.uploadBtn]}
                  />
                ))}
                {
                  // 始终提供一个按钮以便用户可以继续添加图片
                  <TouchableOpacity
                    style={[styles.upload, styles.uploadBtn]}
                    onPress={handleSelectImage}
                  >
                    <Icon name="collections" size={30} />
                    <Text>选择更多图片</Text>
                  </TouchableOpacity>
                }
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
                      source={{ uri: selectedVideoUri?.localUri || '' }}
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
          <FormControl isRequired={true} isInvalid={titleValid}>
            <Input variant="underlined" size="md" ml="$2">
              <InputField placeholder="填写标题" value={title} onChangeText={handleTitleChange} />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>标题不能为空</FormControlErrorText>
            </FormControlError>
          </FormControl>
          <FormControl isRequired={true} isInvalid={descriptionValid}>
            <Textarea
              size="md"
              isInvalid={false}
              mt="$2"
              style={{ borderWidth: 0, height: textareaHeight }}
            >
              <TextareaInput
                placeholder="详细分享你的真实体验、实用攻略和一些小Tip，你的旅游足迹等...."
                value={description}
                onChangeText={handleDescriptionChange}
              />
            </Textarea>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>内容不能为空</FormControlErrorText>
            </FormControlError>
          </FormControl>
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
    // borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBtn: {
    marginRight: 10,
    // borderColor: '#EOEOEO',
  },
  uploadVideo: {
    width: 120,
    height: 120,
    borderRadius: 10,
    // borderStyle: 'solid',
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
