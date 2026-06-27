import SelectModal from "@/components/modalSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from "react-native";
import { z } from "zod";

const schema = z.object({
  type_id: z
    .string()
    .regex(/^\d+$/, "Digite apenas números")
    .refine((n) => Number(n) > 0, "Deve ser maior que 0"),
  animal_id: z
    .string()
    .regex(/^\d+$/, "Digite apenas números")
    .refine((n) => Number(n) > 0, "Deve ser maior que 0"),
  management_date: z.iso.date(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ManagementForms() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      management_date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="mb-1 text-sm font-semibold text-gray-700">
          Tipo de manejo
        </Text>
        <Controller
          control={control}
          name="type_id"
          render={({ field: { onChange, value } }) => (
            <SelectModal
              value={Number(value) ?? null}
              onChange={onChange}
              options={[]}
              placeholder="Selecione o tipo"
              error={errors.type_id?.message}
            />
          )}
        />
        {errors.type_id && (
          <Text className="mb-3 text-xs text-red-500">
            {errors.type_id.message}
          </Text>
        )}
        <Text className="mb-1 text-sm font-semibold text-gray-700">Animal</Text>
        <Controller
          control={control}
          name="animal_id"
          render={({ field: { onChange, value } }) => (
            <SelectModal
              value={Number(value) ?? null}
              onChange={onChange}
              options={[]}
              placeholder="Selecione o tipo"
              error={errors.type_id?.message}
            />
          )}
        />
        {errors.type_id && (
          <Text className="mb-3 text-xs text-red-500">
            {errors.type_id.message}
          </Text>
        )}

        <Text className="mb-1 mt-3 text-sm font-semibold text-gray-700">
          Data do manejo
        </Text>
        <Controller
          control={control}
          name="management_date"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="mb-1 rounded-xl border border-gray-200 px-4 py-3"
              placeholder="AAAA-MM-DD"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.management_date && (
          <Text className="mb-3 text-xs text-red-500">
            {errors.management_date.message}
          </Text>
        )}

        <Text className="mb-1 mt-3 text-sm font-semibold text-gray-700">
          Descrição{" "}
          <Text className="font-normal text-gray-400">(opcional)</Text>
        </Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="mb-1 rounded-xl border border-gray-200 px-4 py-3"
              placeholder="Observações..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <TouchableOpacity
          className="mt-6 items-center rounded-xl bg-black py-4"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="font-bold text-white">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
