import React from "react";
import { Text, useColorScheme } from "react-native";

const LogoTop = () => {
  const colorScheme = useColorScheme();
  return (
    <Text className="py-4 text-center font-open-sans-bold text-white opacity-70">
      LocaNote
    </Text>
  );
};

export default LogoTop;
