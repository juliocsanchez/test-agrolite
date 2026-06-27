import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    type_name: z.string().min(2, "Nome muito curto"),
    is_recurrent: z.boolean(),
    description: z.string().optional(),
    days_interval: z
      .string()
      .regex(/^\d+$/, "Digite apenas números")
      .refine((n) => Number(n) > 0, "Deve ser maior que zero")
      .optional(),
  })

  .refine((data) => !(data.is_recurrent && data.days_interval == null), {
    message: "Obrigatório para manejos recorrentes",
    path: ["days_interval"],
  });

type FormData = z.infer<typeof schema>;

export default function NewType() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_recurrent: false },
  });

  const isRecurrent = useWatch({ control, name: "is_recurrent" });

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      days_interval:
        data.is_recurrent == false ? null : Number(data.days_interval),
      description: data.description == "" ? null : data.description,
    };
    console.log(payload);
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="mb-1 text-sm font-semibold text-gray-700">
        Tipo de manejo
      </Text>
      <Controller
        control={control}
        name="type_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="mb-1 rounded-xl border border-gray-200 px-4 py-3"
            placeholder="Ex: Vacinação"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.type_name && (
        <Text className="mb-3 text-xs text-red-500">
          {errors.type_name.message}
        </Text>
      )}

      <Text className="mb-1 text-sm font-semibold text-gray-700">
        Descrição(opcional)
      </Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="mb-4 rounded-xl border border-gray-200 px-4 py-3"
            onBlur={onBlur}
            placeholder="Descrição"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <View className="mb-4 flex-row items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
        <Text className="text-sm font-semibold text-gray-700">
          Manejo recorrente?
        </Text>
        <Controller
          control={control}
          name="is_recurrent"
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ true: "#000000" }}
            />
          )}
        />
      </View>

      {isRecurrent && (
        <>
          <Text className="mb-1 text-sm font-semibold text-gray-700">
            Intervalo (dias)
          </Text>
          <Controller
            control={control}
            name="days_interval"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="mb-1 rounded-xl border border-gray-200 px-4 py-3"
                placeholder="Ex: 30"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(v) => onChange(v)}
                value={value !== undefined ? String(value) : ""}
              />
            )}
          />
          {errors.days_interval && (
            <Text className="mb-3 text-xs text-red-500">
              {errors.days_interval.message}
            </Text>
          )}
        </>
      )}

      <TouchableOpacity
        className="mt-4 items-center rounded-xl bg-black py-4"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="font-bold text-white">Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
