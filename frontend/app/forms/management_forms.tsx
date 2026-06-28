import SelectModal from "@/components/modalSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { z } from "zod";
import { router } from "expo-router";
import { API_URL } from "../constants/api";

const schema = z.object({
  type_id: z.number({ error: "Selecione um tipo" }).min(1, "Selecione um tipo"),
  animal_id: z
    .number({ error: "Selecione um animal" })
    .min(1, "Selecione um animal"),
  management_date: z.string().min(1, "Data obrigatória"),
  photo_url: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Option {
  id: number;
  label: string;
}

export default function ManagementForms() {
  const [types, setTypes] = useState<Option[]>([]);
  const [animals, setAnimals] = useState<Option[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [usedAnimalIds, setUsedAnimalIds] = useState<number[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/type/`).then((r) => r.json()),
      fetch(`${API_URL}/animal/`).then((r) => r.json()),
    ])
      .then(([typesData, animalsData]) => {
        const typesArray = Array.isArray(typesData)
          ? typesData
          : (typesData?.items ?? typesData?.data ?? []);
        const animalsArray = Array.isArray(animalsData)
          ? animalsData
          : (animalsData?.items ?? animalsData?.data ?? []);

        setTypes(
          typesArray.map((t: any) => ({ id: t.id, label: t.type_name })),
        );
        setAnimals(animalsArray.map((a: any) => ({ id: a.id, label: a.code })));
      })
      .finally(() => setLoadingOptions(false));
  }, []);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      management_date: new Date().toISOString().split("T")[0],
    },
  });

  const selectedTypeId = useWatch({ control, name: "type_id" });

  useEffect(() => {
    if (!selectedTypeId) {
      setUsedAnimalIds([]);
      return;
    }

    setLoadingAnimals(true);
    fetch(`${API_URL}/management/`)
      .then((r) => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const ids = data
            .filter((e) => e.type_id === selectedTypeId)
            .map((e) => e.animal_id);
          setUsedAnimalIds(ids);
        }
      })
      .catch(() => setUsedAnimalIds([]))
      .finally(() => setLoadingAnimals(false));

    reset((data) => ({ ...data, animal_id: 0 }));
  }, [selectedTypeId]);

  const availableAnimals = animals.filter((a) => !usedAnimalIds.includes(a.id));

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/management/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(`Erro ao salvar manejo : ${JSON.stringify(errBody)}`);
      }

      router.replace("/screens/home");
      alert("Manejo salvo com sucesso!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOptions) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

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
              value={value ?? null}
              onChange={onChange}
              options={types}
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
          Animal
        </Text>
        <Controller
          control={control}
          name="animal_id"
          render={({ field: { onChange, value } }) => (
            <SelectModal
              value={value ?? null}
              onChange={onChange}
              options={availableAnimals}
              placeholder={
                loadingAnimals
                  ? "Carregando..."
                  : availableAnimals.length === 0
                    ? "Todos os animais já possuem esse manejo"
                    : "Selecione o animal"
              }
              error={errors.animal_id?.message}
            />
          )}
        />
        {errors.animal_id && (
          <Text className="mb-3 text-xs text-red-500">
            {errors.animal_id.message}
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

        <TouchableOpacity
          className={`mt-6 items-center rounded-xl py-4 ${submitting ? "bg-gray-400" : "bg-black"}`}
          onPress={handleSubmit(onSubmit)}
          disabled={submitting}
        >
          <Text className="font-bold text-white">
            {submitting ? "Salvando..." : "Salvar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
