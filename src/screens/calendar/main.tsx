import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { useClerk } from "@clerk/clerk-expo";

export const CalendarScreen = ({}: RootStackScreenProps<"CalendarScreen">) => {
  const { signOut } = useClerk();
  return (
    <TouchableOpacity className="h-screen flex-1">
      <Text>Calendar!</Text>
    </TouchableOpacity>
  );
};
