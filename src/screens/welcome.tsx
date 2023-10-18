import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { RootStackScreenProps } from "../types/navigation";
import { useClerk } from "@clerk/clerk-expo";

export const Welcome = ({}: RootStackScreenProps<"Welcome">) => {
  const { signOut } = useClerk();
  return (
    <TouchableOpacity onPress={() => signOut()} className="h-screen flex-1">
      <Text>Welcome!</Text>
    </TouchableOpacity>
  );
};
