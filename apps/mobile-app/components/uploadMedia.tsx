import * as ImagePicker from 'expo-image-picker'

/**
 * 异步函数，用于从设备的媒体库中选择图片或视频。
 * @param {Object} options - 选择媒体的选项。
 * @param {boolean} options.allowsMultipleSelection - 是否允许选择多个媒体文件。
 * @param {string} options.mediaTypes - 要选择的媒体类型，'Images'、'Videos' 或 'All'。
 */
export const UploadMedia = async ({ allowsMultipleSelection = false, mediaTypes = 'All' }) => {
  // 请求媒体库访问权限
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (!permissionResult.granted) {
    alert('需要访问媒体库的权限！')
    return []
  }

  // 设置媒体类型
  let mediaTypeOption = ImagePicker.MediaTypeOptions.All
  if (mediaTypes === 'Images') {
    mediaTypeOption = ImagePicker.MediaTypeOptions.Images
  } else if (mediaTypes === 'Videos') {
    mediaTypeOption = ImagePicker.MediaTypeOptions.Videos
  }

  // 启动媒体库，允许用户选择媒体
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: mediaTypeOption,
    allowsMultipleSelection: allowsMultipleSelection,
    base64: false,
  })

  if (result.canceled) {
    return []
  }
  // return allowsMultipleSelection && result.assets ? result.assets : [result]
  return result.assets
}
