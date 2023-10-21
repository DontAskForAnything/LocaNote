import React from "react";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export const PlusSignButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute right-5 bottom-5 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary"
    >
      <AntDesign name="plus" size={32} color={"white"} />
    </TouchableOpacity>
  );
};
