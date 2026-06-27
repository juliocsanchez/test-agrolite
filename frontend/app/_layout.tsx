import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="screens"  />
      <Stack.Screen name="forms/type_forms" options={{ title: "Tipo de manejo" }} />
      <Stack.Screen name="forms/animal_forms" options={{ title: "Cadastrar animal" }} />
      <Stack.Screen name="forms/management_forms" options={{ title: "Manejo" }} />
      <Stack.Screen name="forms/history" options={{ title: "Manejo" }} />
    </Stack>
  );
}