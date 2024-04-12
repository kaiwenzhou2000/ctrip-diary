import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'
// import { NavigationContainer } from '@react-navigation/native'

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={18} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          header: () => <></>,
        }}
      />
      <Tabs.Screen
        name="tab1"
        options={{
          title: '发布',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tab2"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          header: () => <></>,
        }}
      />
    </Tabs>
  )
}
