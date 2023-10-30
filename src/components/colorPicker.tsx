import { FlatList, TouchableOpacity } from "react-native";
import React from "react";

const colors: Array<string> = [
  "#4287f5",
  "#00ccff",
  "#eb4034",
  "#ff00b3",
  "#72a872",
  "#16a34a",
  "#7a00ff",
  "#996cff",
];

interface colorPickerParams {
  selectedColor: string;
  onPress: (color: string) => void;
}

export const ColorPicker = ({ onPress, selectedColor }: colorPickerParams) => {
  return (
    <FlatList
      numColumns={4}
      keyExtractor={(item) => item}
      data={colors}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              onPress(item);
            }}
            style={{ backgroundColor: item }}
            className={`m-1 flex h-20 flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-xl border-2 p-4 ${
              selectedColor === item && "border-white"
            }`}
          ></TouchableOpacity>
        );
      }}
    />
  );
};
