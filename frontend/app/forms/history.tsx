import InfoCard from "@/components/info_card";
import { useCallback, useState } from "react";
import { View, ActivityIndicator, Text, FlatList } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { API_URL } from "../constants/api";

interface History {
  id: number;
  type_name: string;
  management_date: string;
  description: string | null;
  photo_url: string | null;
}

export default function History() {
  const { animal_id } = useLocalSearchParams<{ animal_id: string }>();

  const [management, setManagement] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(() => {
    if (!animal_id) return;

    setLoading(true);
    setError(null);

    fetch(`${API_URL}/animal/history/${animal_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar histórico");
        return res.json();
      })
      .then((data) => setManagement(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [animal_id]);

  useFocusEffect(fetchHistory);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-sm text-red-400">{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 4, gap: 4, flexGrow: 1 }}
      data={management}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <InfoCard
          management_date={item.management_date}
          management_type_name={item.type_name}
          description={item.description ?? "Sem descrição"}
        />
      )}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm text-gray-400">
            O animal não possui histórico de manejo
          </Text>
        </View>
      }
    />
  );
}
