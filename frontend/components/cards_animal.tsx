import { FontAwesome6 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { router, Href } from "expo-router";

interface AnimalCardProps {
  specie: string;
  code: string;
  href: Href;
}

export default function AnimalsCard({ specie, code, href }: AnimalCardProps) {
  return (
    <TouchableOpacity
      className="w-full flex-row items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-md"
      onPress={() => router.push(href)}
    >
      <FontAwesome6 name="cow" size={60} />
      <View className="flex-col">
        <Text className="text-xl font-bold text-gray-800">{code}</Text>
        <Text className="text-sm text-gray-500">{specie}</Text>
      </View>
    </TouchableOpacity>
  );
}
