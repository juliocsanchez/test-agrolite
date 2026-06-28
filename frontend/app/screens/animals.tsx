import { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import AnimalsCard from "@/components/cards_animal";
import { API_URL } from "../constants/api";

interface Animal {
  id: number;
  code: string;
  species: string;
}

export default function Animals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimals = useCallback(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/animal/`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar animais");
        return res.json();
      })
      .then((data: Animal[]) => setAnimals(data))
      .catch(() => setError("Não foi possível carregar os animais."))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(fetchAnimals);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#black" />
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
      data={animals}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <AnimalsCard code={item.code} specie={item.species} id={item.id} />
      )}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm text-gray-400">
            Você não tem animais cadastrados.
          </Text>
        </View>
      }
    />
  );
}
