import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
export const NavigationBar = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <>
      <View className="h-14 flex-row items-center bg-background px-5 dark:bg-background-dark">
        {/* Bigger width, so it's easier to click  */}
        <TouchableOpacity className="w-10" onPress={onPress}>
          <AntDesign
            name="left"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <View className="absolute left-20 right-20 grid place-items-center">
          <Text className="text-center font-open-sans-semibold text-lg text-black dark:text-white">
            {title}
          </Text>
        </View>
      </View>
      <View className="bg-background dark:bg-background-dark">
        <View className="mx-5 border-t border-black dark:border-white" />
      </View>
    </>
  );
};
