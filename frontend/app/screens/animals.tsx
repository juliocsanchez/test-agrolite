import AnimalsCard from "@/components/cards_animal";
import { View, Text } from "react-native";

export default function Animals() {
  return (
    <View className="flex-1 bg-white p-1 items-start justify-start gap-1">
      <AnimalsCard code = "Teste" specie="Teste"></AnimalsCard>
      <AnimalsCard code = "Teste" specie="Teste"></AnimalsCard>
      <AnimalsCard code = "Teste" specie="Teste"></AnimalsCard>
      <AnimalsCard code = "Teste" specie="Teste"></AnimalsCard>
    </View>
  );
}