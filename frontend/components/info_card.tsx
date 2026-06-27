import { Text, View } from "react-native";

interface InfoProps {
  management_date : string;
  management_type_name : string
  description: string;
  status:string;
}

export default function InfoCard({
  management_date,
  management_type_name,
  description,
  status
}: InfoProps) {
  return (
    <View className="w-full flex-col flex-wrap items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-md">
      <Text className="text-3xl font-bold text-gray-800">Data: {management_date}</Text>
      <Text className="text-xl text-gray-800">Tipo de manejo: {management_type_name}</Text>
      {description ? (
        <Text className="text-md text-gray-500">{description}</Text>
      ) : null}
      {
        status == "Pendente"? (
            <Text className="text-md font-bold text-red-800">Status: {status}</Text>
        ) :  <Text className="text-md font-bold text-green-800">Status: {status}</Text>   
      }
      
    </View>
  );
}
