import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { API_URL } from "../constants/api";
import { router } from "expo-router";

const schema = z.object({
  code: z.string().min(6, "O código precisa ter no mínimo 6 caracteres"),
  species: z.string().min(3, "A espécie precisa ter no mínimo 3 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function NewAnimal() {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/animal/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(`Erro ao salvar Animal: ${JSON.stringify(errBody)}`);
      }

      router.replace("/screens/home");
      alert("Animal salvo com sucesso");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setSubmitting(false);
    }
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
        <Text className="mb-3 text-xs text-red-500">{errors.code.message}</Text>
      )}

      <Text className="mb-1 text-sm font-semibold text-gray-700">Espécie</Text>
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
        className={`mt-6 items-center rounded-xl py-4 ${submitting ? "bg-gray-400" : "bg-black"}`}
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="font-bold text-white">
          {" "}
          {submitting ? "Salvando..." : "Salvar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
