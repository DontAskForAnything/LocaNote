import React from "react";
import { RootStackScreenProps } from "../../../types/navigation";
import { NavigationBar } from "../../../components/navigationBar";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordStrategyScreen({
  navigation,
}: RootStackScreenProps<"ForgotPasswordStrategy">) {
  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="bg-background dark:bg-background-dark">
        <NavigationBar
          title="Forgot Password"
          onPress={() => navigation.goBack()}
        />
        <View className="flex h-screen bg-background px-5 pt-4 dark:bg-background-dark">
          <Text className="mb-2 text-center font-open-sans-semibold text-base text-black dark:text-white">
            How do you want to reset you password?
          </Text>

          <TouchableOpacity
            className="mt-4  rounded-2xl bg-input p-4 dark:bg-input-dark"
            onPress={() =>
              navigation.navigate("ForgotPasswordSendCode", {
                verificationType: "email",
              })
            }
          >
            <Text className="text-center font-open-sans-bold text-black dark:text-white">
              With Email
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
