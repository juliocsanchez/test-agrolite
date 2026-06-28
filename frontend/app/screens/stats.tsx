import { useCallback, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useFocusEffect } from "expo-router";
import { API_URL } from "../constants/api";

interface StatsByType {
  type_name: string;
  count: number;
}

interface Stats {
  total_animals: number;
  animals_up_to_date: number;
  percent_up_to_date: number;
  by_type: StatsByType[];
}

export default function ManagementStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(() => {
    setLoading(true);
    fetch(`${API_URL}/stats/`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar estatísticas");
        return res.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(fetchStats);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-sm text-red-400">{error}</Text>
      </View>
    );
  }

  const maxCount = Math.max(...stats.by_type.map((t) => t.count), 1);

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-col items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-5 shadow-md">
        <Text className="mb-1 text-xl font-semibold">Rebanho em dia</Text>
        <Text className="text-4xl font-bold text-gray-900">
          {stats.percent_up_to_date}%
        </Text>
        <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-400">
          <View
            className="h-2 rounded-full bg-green-400"
            style={{ width: `${stats.percent_up_to_date}%` }}
          />
        </View>

        <Text className="mt-2 text-xs text-gray-400">
          {stats.animals_up_to_date} de {stats.total_animals} animais
        </Text>
      </View>
      <View className="mt-5">
        <Text className="mb-4 text-xl font-semibold text-gray-700">
          Manejos por tipo
        </Text>
      </View>

      <FlatList
        data={stats.by_type}
        keyExtractor={(item) => item.type_name}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <View>
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-sm text-gray-700">{item.type_name}</Text>
              <Text className="text-sm font-semibold text-gray-900">
                {item.count}
              </Text>
            </View>
            <View className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <View
                className="h-2 rounded-full bg-black"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-sm text-gray-400">
            Nenhum manejo registrado
          </Text>
        }
      />
    </View>
  );
}
