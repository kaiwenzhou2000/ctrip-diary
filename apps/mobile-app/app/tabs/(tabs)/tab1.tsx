import React from 'react'
import {
  Text,
  View,
  Textarea,
  TextareaInput,
  HStack,
  Card,
  Button,
  ButtonText,
  EditIcon,
} from '@gluestack-ui/themed'
import { TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function Tab2() {
  const handleSelectMedia = () => {}

  const publishTour = () => {}

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBanner}>
        <Text>发文方向tips:旅行、探亲、见家人、美食...</Text>
      </View>
      <Card>
        <View>
          <HStack style={styles.uploadContainer}>
            <TouchableOpacity style={styles.uploadButton}>
              <Icon name="collections" size={30} />
              <Text>选择图片</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton} onPress={handleSelectMedia}>
              <Icon name="add-a-photo" size={30} />
              <Text>上传视频</Text>
            </TouchableOpacity>
          </HStack>
        </View>
        <Text>填写标题</Text>
        <Textarea size="md" isReadOnly={false} isInvalid={false} isDisabled={false} w="$64">
          <TextareaInput placeholder="Your text goes here..." />
        </Textarea>
      </Card>

      <TouchableOpacity style={styles.publishContainer}>
        <Icon as={EditIcon} m="$2" w="$4" h="$4" />
        <Button size="sm" bgColor="$indigo600" onPress={publishTour}>
          <ButtonText color="$white">发布</ButtonText>
        </Button>
      </TouchableOpacity>
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
  uploadButton: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 10,
    borderStyle: 'solid',
    borderColor: '#EOEOEO',
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishContainer: {
    margin: 10,
    flex: 1,
    flexDirection: 'row',
  },
})
