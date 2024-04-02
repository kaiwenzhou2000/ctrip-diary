import React, { useState } from 'react'
import {
  Box,
  Button,
  ButtonText,
  Center,
  Heading,
  Input,
  InputField,
  VStack,
  FormControl,
  InputSlot,
  EyeIcon,
  EyeOffIcon,
  InputIcon,
  Toast,
  ToastTitle,
  useToast,
  FormControlError,
  AlertCircleIcon,
  FormControlErrorIcon,
  FormControlErrorText,
  CheckIcon,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  Avatar,
  AvatarFallbackText,
  Icon,
  ArrowLeftIcon,
  View,
  AvatarImage,
} from '@gluestack-ui/themed'
import Register from '../register'
import { UploadMedia } from '@/components/uploadMedia'
import { Pressable } from 'react-native'

type ChildProps = {
  loginSuccess: () => void
}

export default function Login({ loginSuccess }: ChildProps) {
  const toast = useToast()
  const [username, setUsername] = useState('')
  const [usernameValid, setUsernameValid] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)

  const checkLogin = () => {
    const pattern = /^[A-Za-z0-9_]+$/
    // 用户名正确
    if (pattern.test(username)) {
      setUsernameValid(false)
      // 密码正确
      if (pattern.test(password)) {
        if (!agreeValue) {
          setAgreement(true)
          return
        }
        toast.show({
          placement: 'top',
          render: () => {
            return (
              <Toast variant="solid" action="success">
                <VStack space="xs">
                  <ToastTitle>登录成功</ToastTitle>
                </VStack>
              </Toast>
            )
          },
        })
        loginSuccess()
      } else {
        // 密码错误
        setPasswordValid(true)
        toast.show({
          placement: 'top',
          render: () => {
            return (
              <Toast variant="solid" action="error">
                <VStack space="xs">
                  <ToastTitle>登录失败，密码错误</ToastTitle>
                </VStack>
              </Toast>
            )
          },
        })
      }
    } else {
      // 用户名错误
      setUsernameValid(true)
    }
  }

  const [showPassword, setShowPassword] = useState(false)
  // 显示密码
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }

  const [isAgreement, setAgreement] = useState(false)
  const [agreeValue, setAgreeValue] = useState(false)
  const checkAgreement = (value: boolean) => {
    setAgreeValue(value)
    if (value) {
      setAgreement(false)
    }
  }

  const gotoRegister = () => {
    setRegister(false)
  }

  const [isRegister, setRegister] = useState(true)
  const registerStatus = () => {
    setRegister(true)
  }

  const [selectedAvatar, setSelectedAvatar] = useState<{ localUri: string } | null>(null)
  const handleSelectedAvatar = async () => {
    const image = await UploadMedia({ mediaTypes: 'Images' })
    if (image.length > 0) {
      // 图片为数组，包含许多信息(名称,uri,width)
      const { uri } = image[0]
      setSelectedAvatar({ localUri: uri })
    } else {
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <Toast variant="solid" action="error">
              <VStack space="xs">
                <ToastTitle>授权失败</ToastTitle>
              </VStack>
            </Toast>
          )
        },
      })
    }
  }

  return (
    <View>
      {!isRegister ? (
        <Register registerStatus={registerStatus} />
      ) : (
        <Center flex={1}>
          <Heading size="3xl" color="$indigo600">
            游小记
          </Heading>
          <Box
            p="$5"
            maxWidth="$96"
            borderWidth="$1"
            borderColor="$backgroundLight300"
            borderRadius="$lg"
            $dark-borderColor="$backgroundDark700"
          >
            <VStack space="xs" pb="$4" w="$80" alignItems="center">
              <Heading lineHeight={30}>用户登录</Heading>
              <Pressable onPress={handleSelectedAvatar}>
                <Avatar bgColor="$amber600" size="lg" borderRadius="$full">
                  <AvatarFallbackText>Rinna Chen</AvatarFallbackText>
                  {selectedAvatar !== null && (
                    <AvatarImage
                      alt=""
                      source={{
                        uri: selectedAvatar.localUri,
                      }}
                    ></AvatarImage>
                  )}
                </Avatar>
              </Pressable>
            </VStack>
            <VStack space="xl" py="$2">
              <FormControl isInvalid={usernameValid} isRequired={true}>
                <Input>
                  <InputField
                    py="$2"
                    placeholder="请输入用户名"
                    value={username}
                    onChangeText={setUsername}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>仅可输入字母、数字和下划线</FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl isInvalid={passwordValid}>
                <Input>
                  <InputField
                    py="$2"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入密码"
                    value={password}
                    onChangeText={setPassword}
                  />
                  <InputSlot pr="$3" onPress={handleState}>
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} color="$darkBlue500" />
                  </InputSlot>
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    无效的密码，仅可输入字母、数字和下划线
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
            <VStack space="lg" pt="$4">
              <Button size="sm" bgColor="$indigo600" onPress={checkLogin}>
                <ButtonText color="$white">登录</ButtonText>
              </Button>
            </VStack>
            <VStack pt="$4">
              <Checkbox
                aria-label="check"
                size="md"
                isInvalid={isAgreement}
                isDisabled={false}
                onChange={checkAgreement}
                value={''}
              >
                <CheckboxIndicator mr="$2">
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>我已阅读并同意《用户协议》</CheckboxLabel>
              </Checkbox>
              <Box flexDirection="row">
                <Button variant="link" p="$0" size="md" onPress={gotoRegister}>
                  <Icon size="md" mr="$1" as={ArrowLeftIcon} />
                  <ButtonText>注册</ButtonText>
                </Button>
              </Box>
            </VStack>
          </Box>
        </Center>
      )}
    </View>
  )
}
