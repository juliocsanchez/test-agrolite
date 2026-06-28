import { Tabs } from "expo-router";
import { FontAwesome, FontAwesome6, MaterialIcons ,Ionicons } from "@expo/vector-icons";

export default function ScreensLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
          height: 60,
          paddingBottom: 8,
        },
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="animals"
        options={{
          title: "Animais",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="cow" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="stats"
        options={{
          title: "Dados",
          tabBarIcon: ({ color, size }) => (
          <Ionicons name="analytics-outline" size={size} color={color} />),
        }}
      />
    </Tabs>
  );
}
