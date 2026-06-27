import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    code : z.string().min(6,"O código precisa ter no mínimo 6 caracteres"),
    species : z.string().min(3,"A espécie precisa ter no mínimo 3 caracteres")
  })

type FormData = z.infer<typeof schema>;

export default function NewAnimal() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
});

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="mb-1 text-sm font-semibold text-gray-700">
        Código do animal
      </Text>
      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="mb-1 rounded-xl border border-gray-200 px-4 py-3"
            placeholder="Ex: BOV-001"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.code && (
        <Text className="mb-3 text-xs text-red-500">
          {errors.code.message}
        </Text>
      )}

      <Text className="mb-1 text-sm font-semibold text-gray-700">
        Espécie
      </Text>
      <Controller
        control={control}
        name="species"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="mb-4 rounded-xl border border-gray-200 px-4 py-3"
            onBlur={onBlur}
            placeholder="Ex: Boi"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <TouchableOpacity
        className="mt-4 items-center rounded-xl bg-black py-4"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="font-bold text-white">Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
