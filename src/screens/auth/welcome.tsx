import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

export default function WelcomeScreen({
  navigation,
}: RootStackScreenProps<"Welcome">) {
  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex h-screen bg-background dark:bg-background-dark">
        <View className="inline-flex flex-col items-center justify-start p-12">
          <View className="mt-8 flex h-40 flex-col items-start justify-start self-stretch">
            <Text className="self-stretch text-center font-open-sans-bold text-5xl text-white">
              Welcome to LocaNote
            </Text>
            <Text className="mt-2 self-stretch text-center font-open-sans-regular text-base leading-normal text-white">
              Let's start here!
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("LogInStrategy");
            }}
            className="mb-2 inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4"
          >
            <Text className="font-open-sans-bold text-xl dark:text-white">
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUpStrategy");
            }}
            className="mt- flex w-full flex-col justify-center"
          >
            <Text className="text-center font-open-sans-regular text-sm text-black dark:text-white">
              or
            </Text>

            <Text className="text-center font-open-sans-bold text-base text-black dark:text-white">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          className="flex-1 opacity-80"
          source={require("../../../assets/background_welcome.png")}
        />
      </SafeAreaView>
    </View>
  );
}
