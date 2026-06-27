import React, { useState, useMemo } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { CALENDAR } from "../constants";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

LocaleConfig.locales["pt-br"] = {
  monthNames: [...CALENDAR.monthNames],
  monthNamesShort: [...CALENDAR.monthNamesShort],
  dayNames: [...CALENDAR.dayNames],
  dayNamesShort: [...CALENDAR.dayNamesShort],
  today: CALENDAR.today,
};

LocaleConfig.defaultLocale = "pt-br";

const MANEJOS: Record<
  string,
  { id: number; type: string; animal: string; description: string }[]
> = {
  "2026-06-25": [
    { id: 1, type: "teste", animal: "teste", description: "teste" },
  ],
  "2026-06-27": [
    { id: 2, type: "vermifugação", animal: "Boi", description: "manejo" },
  ],
};

const MARKED_DATES = Object.fromEntries(
  Object.keys(MANEJOS).map((date) => [
    date,
    { marked: true, dotColor: "#27F59F" },
  ]),
);

const THEME = {
  selectedDayBackgroundColor: "#27F59F",
  selectedDayTextColor: "#9CBF7E",
  todayTextColor: "#279CF5",
  dotColor: "#27F59F",
  arrowColor: "#000000",
};

export default function ManegementCalendar() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const managementsToday = MANEJOS[selectedDate] ?? [];

  const markedDates = useMemo(
    () => ({
      ...MARKED_DATES,
      [selectedDate]: {
        ...MARKED_DATES[selectedDate],
        selected: true,
        selectedColor: "27F59F",
      },
    }),
    [selectedDate],
  );

  const formatData = selectedDate.split("-").reverse().join("/");

  return (
    <View className="flex-1 bg-white">
      <Calendar
        current={today}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={THEME}
        firstDay={0}
      />

      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-5">
        <Text className="text-sm font-semibold text-gray-500">
          {formatData}
        </Text>
        <Text className="text-xs text-gray-400">
          {managementsToday.length} manejo(s)
        </Text>
      </View>

      <FlatList
        data={managementsToday}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-xs text-gray-600">
              Nenhum manejo para este dia
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity className="mb-3 flex-row items-center justify-between rounded-xl border border-gray-100 bg-white p-4">
            <View className="flex-1">
              <Text className="text-3xl font-semibold text-gray-800">
                {item.animal}
              </Text>
              <Text className="mt-1 text-2xl text-gray-400">{item.type}</Text>
              {item.description ? (
                <Text className="mt-1 text-base text-gray-400">
                  {item.description}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      ></FlatList>
    </View>
  );
}
