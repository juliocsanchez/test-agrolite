import { Text, View } from "react-native";
import Card from "@/components/cards_create";

export default function Index() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row flex-wrap justify-start p-4">
        <Card
          iconName="cow"
          title="Cadastrar Animal"
          description="Adicione um novo bovino ao sistema"
          color="black"
        />

        <Card
          iconName="hands"
          title="Manejo"
          description="Cadastre um novo manejo"
          color="black"
        />

        <Card
          iconName="wpforms"
          title="Tipo de manejo"
          description="Cadastre um novo tipo de manejo"
          color="black"
        />
      </View>
    </View>
  );
}
