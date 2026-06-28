import React, { useState, useMemo, useCallback } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { CALENDAR } from "../constants";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "../constants/api";
import { useFocusEffect } from "expo-router";

LocaleConfig.locales["pt-br"] = {
  monthNames: [...CALENDAR.monthNames],
  monthNamesShort: [...CALENDAR.monthNamesShort],
  dayNames: [...CALENDAR.dayNames],
  dayNamesShort: [...CALENDAR.dayNamesShort],
  today: CALENDAR.today,
};

LocaleConfig.defaultLocale = "pt-br";

const THEME = {
  selectedDayBackgroundColor: "black",
  selectedDayTextColor: "white",
  todayTextColor: "#279CF5",
};

const STATUS = {
  past: { label: "Realizado", bg: "bg-yellow-100", text: "text-yellow-600" },
  scheduled: { label: "Agendado", bg: "bg-green-100", text: "text-green-700" },
  future: { label: "Previsto", bg: "bg-blue-100", text: "text-blue-600" },
  pending: { label: "Atrasado", bg: "bg-red-100", text: "text-red-600" },
};

const PRIORITY: Record<string, number> = {
  "green-500": 3,
  "yellow-500": 2,
  "red-500": 1,
};

interface ManagementEvent {
  id: number;
  type_name: string;
  animal_code: string;
  management_date: string;
  description: string | null;
  days_interval: number | null;
  photo_url: string | null;
}

interface ManagementDate {
  key: string;
  type_name: string;
  animal_code: string;
  description: string | null;
  status: "past" | "scheduled" | "future" | "pending";
}

function getManagementFutureDays(
  initial_date: string,
  interval: number,
  today: string,
): { date: string; pending: boolean }[] {
  const result: { date: string; pending: boolean }[] = [];
  const futureDaysLimit = new Date(today);
  futureDaysLimit.setMonth(futureDaysLimit.getMonth() + 6);

  let next = new Date(initial_date);
  next.setDate(next.getDate() + interval);

  while (next <= futureDaysLimit) {
    const dateString = next.toISOString().split("T")[0];
    result.push({ date: dateString, pending: dateString < today });
    next = new Date(next);
    next.setDate(next.getDate() + interval);
  }

  return result;
}

function markDate(
  marks: Record<string, { marked: boolean; dotColor: string }>,
  date: string,
  color: string,
) {
  const current = marks[date]?.dotColor;
  if (!current || PRIORITY[color] > PRIORITY[current]) {
    marks[date] = { marked: true, dotColor: color };
  }
}

export default function ManegementCalendar() {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState<ManagementEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/management/`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar o manejo");
        return res.json();
      })
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(fetchEvents);

  const { eventsByDate, markedDates } = useMemo(() => {
    const byDate: Record<string, ManagementDate[]> = {};
    const marks: Record<string, { marked: boolean; dotColor: string }> = {};

    const addEvent = (date: string, event: ManagementDate) => {
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(event);
    };

    events.forEach((event) => {
      const isPending = event.management_date < today;

      addEvent(event.management_date, {
        key: `real-${event.id}`,
        type_name: event.type_name,
        animal_code: event.animal_code,
        description: event.description,
        status: isPending ? "past" : "scheduled",
      });

      markDate(marks, event.management_date, isPending ? "yellow" : "green");

      if (event.days_interval) {
        getManagementFutureDays(
          event.management_date,
          event.days_interval,
          today,
        ).forEach(({ date, pending }) => {
          addEvent(date, {
            key: `proj-${event.id}-${date}`,
            type_name: event.type_name,
            animal_code: event.animal_code,
            description: event.description,
            status: pending ? "pending" : "future",
          });
          markDate(marks, date, pending ? "red" : "green");
        });
      }
    });
    return { eventsByDate: byDate, markedDates: marks };
  }, [events, today]);

  const dayEvents = eventsByDate[selectedDate] ?? [];

  const finalMarkedDates = useMemo(
    () => ({
      ...markedDates,
      [selectedDate]: {
        ...markedDates[selectedDate],
        selected: true,
        selected_color: "green",
      },
    }),
    [markedDates, selectedDate],
  );

  const formatData = selectedDate.split("-").reverse().join("/");

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-sm text-red-400">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Calendar
        current={today}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={finalMarkedDates}
        theme={THEME}
        firstDay={0}
      />

      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-5">
        <Text className="text-sm font-semibold text-gray-500">
          {formatData}
        </Text>
        <Text className="text-xs text-gray-400">
          {dayEvents.length} manejo(s)
        </Text>
      </View>

      <FlatList
        data={dayEvents}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-xs text-gray-600">
              Nenhum manejo para este dia
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const config = STATUS[item.status];
          return (
            <TouchableOpacity className="mb-3 flex-row items-center justify-between rounded-xl border border-gray-100 bg-white p-4">
              <View className="flex-1">
                <Text className="text-3xl font-semibold text-gray-800">
                  {item.animal_code}
                </Text>
                <Text className="mt-1 text-2xl text-gray-400">
                  {item.type_name}
                </Text>
                {item.description ? (
                  <Text className="ms-1 mt-1 text-base text-gray-400">
                    {item.description}
                  </Text>
                ) : null}
                <View
                  className={`mt-1 self-start rounded-full px-2 py-0.5 ${config.bg}`}
                >
                  <Text className={`text-xs`}>{config.label}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      ></FlatList>
    </View>
  );
}
