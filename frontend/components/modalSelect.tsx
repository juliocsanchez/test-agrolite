import { useState } from "react";
import { TouchableOpacity, Text, Modal, View, FlatList } from "react-native";

export default function SelectModal({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: number | null;
  onChange: (id: number) => void;
  options: { id: number; label: string }[];
  placeholder: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);

  return (
    <>
      <TouchableOpacity
        className={`mb-1 flex-row items-center justify-between rounded-xl border px-4 py-3 ${
          error ? "border-red-400" : "border-gray-200"
        }`}
        onPress={() => setOpen(true)}
      >
        <Text className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text className="text-gray-400">▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 justify-end bg-black/40"
          onPress={() => setOpen(false)}
        >
          <View className="rounded-t-2xl bg-white p-4">
            <Text className="mb-3 text-center text-sm font-semibold text-gray-500">
              {placeholder}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`rounded-xl px-4 py-3 ${
                    item.id === value ? "bg-green-400" : ""
                  }`}
                  onPress={() => { onChange(item.id); setOpen(false); }}
                >
                  <Text className={item.id === value ? "font-semibold text-black" : "text-gray-800"}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}