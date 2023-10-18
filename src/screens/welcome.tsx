import React from "react";
import { Text, View } from "react-native";
import { RootStackScreenProps } from "../types/navigation";

export const Welcome = ({}: RootStackScreenProps<"Welcome">) => {
  return (
    <View className="flex-1">
      <Text>Welcome!</Text>
    </View>
  );
};
