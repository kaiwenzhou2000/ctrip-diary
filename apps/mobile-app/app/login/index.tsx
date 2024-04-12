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
  AvatarImage,
} from '@gluestack-ui/themed'
import { Animated, StyleSheet } from 'react-native'
import { useAuth } from '@/components/authContext'
import { router } from 'expo-router'
import { loginUser } from '../api/user'

interface LoginProps {
  type: string
  opacity?: Animated.AnimatedInterpolation<number>
}

export default function Login({ type, opacity }: LoginProps) {
  const toast = useToast()
  const { setIsLoggedIn, setUserId, username, setDataUsername } = useAuth()
  const [disabledLogin, setDisabledLogin] = useState(false)
  const [loginUsername, setLoginUsername] = useState<string>('')
  const [usernameValid, setUsernameValid] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)

  const checkLogin = async () => {
    // 首先进行表单校验
    const pattern = /^[A-Za-z0-9_]+$/
    if (pattern.test(username)) {
      setUsernameValid(false)
    } else {
      setUsernameValid(true)
    }
    if (pattern.test(password)) {
      setPasswordValid(false)
    } else {
      setPasswordValid(true)
    }
    if (!agreeValue) {
      setAgreement(true)
      return
    }

    const userInfo = {
      username,
      password,
    }

    // 1. 用户名、密码正确，数据库无 - 未注册
    // 2. 用户名或密码错误，数据库有 - 账号或密码错误
    // 3. 用户名、密码正确，数据库有 - 登录成功

    // 与数据库比对
    try {
      const { message, data } = await loginUser(userInfo)
      // 如果用户名、密码正确，数据库有，则登录成功
      if (message === 'success') {
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
        // 登录成功设置状态
        setIsLoggedIn(true)
        const { _id } = data
        if (_id) {
          setUserId(_id)
          setDataUsername(username)
        }
        if (type === 'tab2') {
          router.push('/tabs/(tabs)/tab2')
        } else {
          router.push('/tabs/(tabs)/tab1')
        }
      } else if (message === 'error') {
        // 用户名、密码正确，数据库无,则未注册
        toast.show({
          placement: 'top',
          render: () => {
            return (
              <Toast variant="solid" action="error">
                <VStack space="xs">
                  <ToastTitle>账号未注册</ToastTitle>
                </VStack>
              </Toast>
            )
          },
        })
        setDisabledLogin(true)
      } else {
        toast.show({
          placement: 'top',
          render: () => {
            return (
              <Toast variant="solid" action="warning">
                <VStack space="xs">
                  <ToastTitle>登录失败，账号或密码错误</ToastTitle>
                </VStack>
              </Toast>
            )
          },
        })
      }
    } catch (err) {
      console.log(err)
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
    router.push('/register/')
  }

  return (
    <Center flex={1}>
      <Animated.View style={[styles.container, { opacity }]}>
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
            <Avatar bgColor="$indigo600" size="lg" borderRadius="$full">
              <AvatarFallbackText></AvatarFallbackText>
              <AvatarImage alt="" source={require('@/assets/images/avatar.jpg')} />
            </Avatar>
          </VStack>
          <VStack space="xl" py="$2">
            <FormControl isInvalid={usernameValid} isRequired={true}>
              <Input>
                <InputField
                  py="$2"
                  placeholder="请输入用户名"
                  value={loginUsername}
                  onChangeText={setLoginUsername}
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
                <FormControlErrorText>无效的密码，仅可输入字母、数字和下划线</FormControlErrorText>
              </FormControlError>
            </FormControl>
          </VStack>
          <VStack space="lg" pt="$4">
            <Button size="sm" bgColor="$indigo600" onPress={checkLogin} isDisabled={disabledLogin}>
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
      </Animated.View>
    </Center>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
