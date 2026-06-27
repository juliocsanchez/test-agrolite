import InfoCard from "@/components/info_card";
import { View } from "react-native";

export default function History() {
  return (
    <View className="flex-1 items-start justify-start flex-col gap-1 bg-white p-1">
      <InfoCard
        management_date="2020-03-10"
        management_type_name="Vermifugação"
        description="Tratamento de Vermes"
        status="Pendente"
      ></InfoCard>

      <InfoCard
        management_date="2020-03-10"
        management_type_name="Vermifugação"
        description="Tratamento de Vermes"
        status="Ok"
      ></InfoCard>
    </View>
  );
}
