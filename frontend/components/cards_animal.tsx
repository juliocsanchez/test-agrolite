import { FontAwesome6 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

interface AnimalCardProps {
  id: number;
  specie: string;
  code: string;
}

export default function AnimalsCard({ specie, code, id }: AnimalCardProps) {
  const handleAnimalHistory = () => {
    router.push({
      pathname: "/forms/history",
      params: { animal_id: id },
    });
  };
  return (
    <TouchableOpacity
      className="w-full flex-row items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-md"
      onPress={handleAnimalHistory}
    >
      <FontAwesome6 name="cow" size={60} />
      <View className="flex-col">
        <Text className="text-xl font-bold text-gray-800">{code}</Text>
        <Text className="text-sm text-gray-500">{specie}</Text>
      </View>
    </TouchableOpacity>
  );
}
