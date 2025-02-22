import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import Animated, { withSpring } from 'react-native-reanimated';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const TabIcon = ({ name, focused, color, size }) => (
    <Animated.View
      style={{
        transform: [
          {
            scale: withSpring(focused ? 1.2 : 1)
          }
        ]
      }}
    >
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        tabBarLabelStyle: {
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="chatbubbles" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: 'Mood',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="heart" size={size} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="person" size={size} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}