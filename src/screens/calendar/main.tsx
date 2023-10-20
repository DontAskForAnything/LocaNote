import React, { useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { Calendar } from "react-native-calendars";
export const CalendarScreen = ({}: RootStackScreenProps<"CalendarScreen">) => {
  // const [selectedDay, setSelectedDay] = useState(new Date(Date.now()).toISOString().split('T')[0]);
  const [selectedDay, setSelectedDay] = useState("1970-1-1");

  return (
    <KeyboardAvoidingView className="h-screen flex-1">
      <Calendar
        firstDay={1}
        markedDates={{
          [selectedDay]: { selected: true },
        }}
        className="bg-input-dark"
        theme={{
          arrowColor: "#16A34A",
          textSectionTitleColor: "white",
          monthTextColor: "white",
          calendarBackground: "#1B1B1B",
          backgroundColor: "#1B1B1B",
          dayTextColor: "white",
          textDisabledColor: "grey",
          selectedDotColor: "blue",
          selectedDayBackgroundColor: "#00adf5",
          todayTextColor: "#16A34A",
          selectedDayTextColor: "white",
        }}
        onDayPress={(day) => {
          setSelectedDay(day.dateString);
        }}
      />
    </KeyboardAvoidingView>
  );
};
