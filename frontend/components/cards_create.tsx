import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import "../global.css";

interface CardProps {
  iconName: keyof typeof FontAwesome6.glyphMap;
  title: string;
  description: string;
  color: string;
}

export default function Card({
  iconName,
  title,
  description,
  color,
}: CardProps) {
  return (
    <TouchableOpacity className="flex-start bottom-2 w-1/2 gap-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
      <FontAwesome6 name={iconName} size={60} color={color} />
      <Text className="text-xl font-bold text-gray-800">{title}</Text>
      {description ? (
        <Text className="text-sm text-gray-500">{description}</Text>
      ) : null}
    </TouchableOpacity>
  );
}
