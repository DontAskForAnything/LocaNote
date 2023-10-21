import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { useClerk } from "@clerk/clerk-expo";

export const MainScreen = ({}: RootStackScreenProps<"MainScreen">) => {
  const { signOut } = useClerk();
  return (
    <TouchableOpacity onPress={() => signOut()} className="h-screen flex-1">
      <Text>Just chilling here till someone do me {">_<"}</Text>
    </TouchableOpacity>
  );
};
