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
  Image,
  FormControl,
  AlertCircleIcon,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  Toast,
  ToastTitle,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { TouchableOpacity, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { UploadMedia } from '@/components/uploadMedia'
import { Video, ResizeMode } from 'expo-av'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { router } from 'expo-router'
import { publishTourItem } from '../api/tour'
// import { updateTourItem, getTourItem } from '../api/tour'
import { useAuth } from '@/components/authContext'

export default function Publish() {
  const { userId } = useAuth()
  const toast = useToast()

  // useEffect(() => {
  //   // 重新编辑游记，回填数据
  //   const getReleaseNote = async () => {
  //     const res = await getTourItem('6616075f4404239f23d61489')
  //     const { title, description, imgUrls, videoUrl } = res.data
  //     const imgList = imgUrls.map((imgUrl) => ({ uri: imgUrl }))
  //     setTitle(title)
  //     setDescription(description)
  //     setHasMedia(true)
  //     if (imgUrls) {
  //       setHasImages(true)
  //       setImageList(imgList)
  //     }
  //     if (videoUrl) {
  //       setHasVideo(true)
  //       setSelectedVideoUri({ localUri: videoUrl })
  //     }
  //   }
  //   // 替换为实际publishId
  //   if (publishId) {
  //     getReleaseNote()
  //   }
  // }, [])

  const [titleValid, setTitleValid] = useState(false)
  const [title, setTitle] = useState('')
  // 标题变化的回调
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
  // 描述内容变化的回调
  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    if (!value) {
      setDescriptionValid(true)
    } else {
      setDescriptionValid(false)
    }
  }

  interface ImageState {
    uri: string
    mimeType: string
    type?: string
    fileName?: string
  }

  const [hasMedia, setHasMedia] = useState(false)
  const [hasImages, setHasImages] = useState(false)
  const [imageList, setImageList] = useState<ImageState[]>([])

  const videoRef = useRef(null)

  const [hasVideo, setHasVideo] = useState(false)
  const [selectedVideoUri, setSelectedVideoUri] = useState<{ localUri: string } | null>(null)
  const [selectedVideo, setSelectedVideo] = useState({
    uri: '',
    type: '',
    fileName: '',
    cover: '',
  })

  const [imgCover, setImgCover] = useState<{ uri: string } | null>(null)
  const [videoCover, setVideoCover] = useState<{ uri: string } | null>(null)

  // 上传图片或视频
  const handleSelectImgOrVideo = async () => {
    const medias = await UploadMedia({
      allowsMultipleSelection: true,
      mediaTypes: 'All',
    })
    if (medias.length > 0) {
      setHasMedia(true)

      // 过滤图片
      const selectedImages = medias.filter((media) => media?.mimeType?.startsWith('image'))
      if (selectedImages.length > 0) {
        const newImageList = [...imageList.filter((img) => img.uri), ...selectedImages]
        setImageList(newImageList)
        setHasImages(true)
        if (newImageList[0]) {
          setImgCover({ uri: newImageList[0].uri })
        }
      }

      // 过滤视频
      const selectedVideos = medias.filter((media) => media?.mimeType?.startsWith('video'))
      if (selectedVideos.length > 0) {
        const selectedVideo = selectedVideos[0]
        if (selectedVideo) {
          setSelectedVideo(selectedVideo)
          setSelectedVideoUri({ localUri: selectedVideo.uri })
          setHasVideo(true)
          setVideoCover({ uri: selectedVideo.cover })
        }
      }
    }
  }

  // 发布
  const publishTour = async () => {
    if (!title) {
      setTitleValid(true)
      return
    }
    if (!description) {
      setDescriptionValid(true)
      return
    }
    if (imageList.length === 0 && !selectedVideoUri?.localUri) {
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <Toast variant="solid" action="error">
              <VStack space="xs">
                <ToastTitle>请至少上传图片</ToastTitle>
              </VStack>
            </Toast>
          )
        },
      })
      return
    }
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    if (selectedVideo) {
      const filename = selectedVideoUri?.localUri.split('/').pop()
      formData.append('video', {
        uri: selectedVideoUri?.localUri,
        name: filename,
        type: selectedVideo.type,
      })
    }
    if (imageList) {
      imageList.forEach((img) => {
        const imgFilename = img?.uri.split('/').pop()
        const imgData = {
          uri: img.uri,
          name: imgFilename,
          type: img.type,
        }
        formData.append('images', imgData)
      })
    }
    if (imgCover || videoCover) {
      const coverUri = imgCover ? imgCover : videoCover
      const filename = coverUri?.uri.split('/').pop()
      formData.append('cover', {
        uri: coverUri?.uri,
        name: filename,
        type: 'image',
      })
    }
    try {
      // 替换为实际publishId
      // const publishId = '6616075f4404239f23d61489'
      // if (publishId) {
      // await updateTourItem(publishId, formData)
      // } else {
      await publishTourItem(userId, formData)
      // }
      router.push('/tabs/(tabs)/tab2')
    } catch (e) {
      console.log(e)
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
                {!hasMedia ? (
                  <TouchableOpacity
                    style={[styles.upload, styles.uploadBtn]}
                    onPress={handleSelectImgOrVideo}
                  >
                    <Icon name="add-a-photo" size={30} />
                    <Text>选择图片/视频</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    {hasImages &&
                      imageList.map((img, index) => {
                        return (
                          <Image
                            key={index}
                            alt=""
                            source={{ uri: img.uri }}
                            style={[styles.upload, styles.uploadBtn]}
                            resizeMode={ResizeMode.COVER}
                          />
                        )
                      })}
                    {hasVideo && (
                      <Video
                        ref={videoRef}
                        source={{ uri: selectedVideoUri?.localUri || '' }}
                        rate={1.0}
                        volume={1}
                        isMuted={false}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay
                        isLooping
                        useNativeControls
                        style={styles.uploadVideo}
                      />
                    )}
                    <TouchableOpacity
                      style={[styles.upload, styles.uploadBtn]}
                      onPress={handleSelectImgOrVideo}
                    >
                      <Icon name="collections" size={30} />
                      <Text>选择图片/视频</Text>
                    </TouchableOpacity>
                  </>
                )}
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
            <Pressable style={styles.saveBtn}>
              {({ pressed }) => (
                <>
                  <FontAwesome name="save" size={18} color={pressed ? 'grey' : 'black'} />
                  <Text mt={5} color={pressed ? 'grey' : 'black'}>
                    存草稿
                  </Text>
                </>
              )}
            </Pressable>
          </View>
          <Pressable>
            {({ pressed }) => (
              <Button
                variant="solid"
                size="md"
                width={200}
                onPress={publishTour}
                bgColor={pressed ? '$indigo400' : '$indigo600'}
              >
                <ButtonText color={pressed ? '$whitePressed' : '$white'}>发布</ButtonText>
              </Button>
            )}
          </Pressable>
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
    height: 150,
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
    height: 150,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
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
