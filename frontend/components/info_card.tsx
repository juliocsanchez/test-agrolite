import { Text, View } from "react-native";

interface InfoProps {
  management_date: string;
  management_type_name: string;
  description: string;
}

export default function InfoCard({
  management_date,
  management_type_name,
  description,
}: InfoProps) {
  return (
    <View className="mb-3 rounded-xl border border-gray-100 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-gray-800">
          {management_type_name}
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-gray-800">
          {management_date}
        </Text>
      </View>
      {description && (
        <Text className="mt-1 text-sm text-gray-400">{description}</Text>
      )}
    </View>
  );
}
