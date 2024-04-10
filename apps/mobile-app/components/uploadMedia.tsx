import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import * as VideoThumbnails from 'expo-video-thumbnails'

/**
 * 异步函数，用于从设备的媒体库中选择图片或视频。
 * @param {Object} options - 选择媒体的选项。
 * @param {boolean} options.allowsMultipleSelection - 是否允许选择多个媒体文件。
 * @param {string} options.mediaTypes - 要选择的媒体类型，'Images'、'Videos' 或 'All'。
 * @param {[number,number]} options.aspect - 指定裁剪比例
 */
export const UploadMedia = async ({
  allowsMultipleSelection = false,
  mediaTypes = 'All',
  // allowEditing = false,
  aspect = [3, 4] as [number, number],
}) => {
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
    allowsMultipleSelection: allowsMultipleSelection, // 支持多选
    base64: false,
    allowsEditing: mediaTypes === 'Images', // 允许编辑仅对图片有效
    aspect: aspect, // 指定裁剪宽高比
    quality: 1, // 图片质量
  })

  if (result.canceled) {
    return []
  }

  // 上传完处理压缩
  const extraProcessAssets = await Promise.all(
    result.assets.map(async (asset) => {
      // 如果是图片，使用ImageManipulator进行压缩
      if (asset.type === 'image') {
        const compressedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [],
          { compress: 0.5 } // 压缩率
        )
        return { ...asset, uri: compressedImage.uri }
      }

      // 视频压缩（暂无）
      if (asset.type === 'video') {
        const firstFrameUri = await getVideoFirstFrame(asset.uri)
        return { ...asset, cover: firstFrameUri }
        // return asset
      }
    })
  )
  return extraProcessAssets
}

// 获取视频的第一帧
const getVideoFirstFrame = async (videoUri: string) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 1,
    })
    console.log(uri)
    return uri
  } catch (e) {
    console.error(e, '???')
    return null
  }
}
