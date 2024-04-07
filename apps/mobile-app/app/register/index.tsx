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
} from '@gluestack-ui/themed'
import { router } from 'expo-router'
import { registerUser } from '../api/user'

export default function Register() {
  const toast = useToast()
  const [username, setUsername] = useState('')
  const [usernameValid, setUsernameValid] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)

  const handleRegister = async () => {
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
        const userInfo = {
          username,
          password,
        }
        await registerUser(userInfo)
        toast.show({
          placement: 'top',
          render: () => {
            return (
              <Toast variant="solid" action="success">
                <VStack space="xs">
                  <ToastTitle>注册成功</ToastTitle>
                </VStack>
              </Toast>
            )
          },
        })
        // 注册成功进入登录页面
        router.push('/login/')
        router.setParams({ name: username })
      } else {
        // 密码校验失败
        setPasswordValid(true)
      }
    } else {
      // 用户名校验错误
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
  // 同意协议
  const checkAgreement = (value: boolean) => {
    setAgreeValue(value)
    if (value) {
      setAgreement(false)
    }
  }

  return (
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
          <Heading lineHeight={30}>注册</Heading>
          <Avatar bgColor="$amber600" size="lg" borderRadius="$full">
            <AvatarFallbackText>Rinna Chen</AvatarFallbackText>
          </Avatar>
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
              <FormControlErrorText>无效的密码，仅可输入字母、数字和下划线</FormControlErrorText>
            </FormControlError>
          </FormControl>
        </VStack>
        <VStack space="lg" pt="$4">
          <Button size="sm" bgColor="$indigo600" onPress={handleRegister}>
            <ButtonText color="$white">注册</ButtonText>
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
        </VStack>
      </Box>
    </Center>
  )
}
