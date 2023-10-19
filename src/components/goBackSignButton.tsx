import React from "react";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export const GoBackSignButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute left-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary"
    >
      <AntDesign name="left" size={20} color={"white"} />
    </TouchableOpacity>
  );
};
