import React from "react";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export const AddButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        bottom: 50 + 56 + 20, // Tab height, icon height, added distance
        right: 20, // added distance
      }}
      className="absolute z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary"
    >
      <AntDesign name="plus" size={30} color={"white"} />
    </TouchableOpacity>
  );
};
