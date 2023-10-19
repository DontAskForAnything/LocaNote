import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import SignInWithOAuthButton from "../../components/SignInWithOAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoBackSignButton } from "../../components/goBackSignButton";

export default function SignUpStrategyScreen({
  navigation,
}: RootStackScreenProps<"SignUpStrategy">) {
  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex w-11/12 self-center bg-background dark:bg-background-dark">
        <View className="h-screen bg-background px-5 pt-6 dark:bg-background-dark">
          <GoBackSignButton onPress={() => navigation.goBack()} />

          <View className="flex  h-1/3 w-full items-center justify-end">
            <Text className="font-open-sans-semibold text-base text-gray-500">
              LocaNote
            </Text>
            <Text className="my-1 font-open-sans-bold text-4xl text-white">
              Sign Up
            </Text>
            <Text className="font-open-sans-semibold text-base text-gray-500">
              Select method
            </Text>
          </View>

          <View className="mt-12 h-2/3">
            <SignInWithOAuthButton
              oauth_strategy="oauth_google"
              themeVariant="google"
              text="Sign Up with Google"
              iconName="google"
              onNewAccount={() => navigation.navigate("UsernameChoose")}
            />

            <Text className="my-4 text-center font-open-sans-regular text-xs text-black dark:text-white">
              or
            </Text>

            <TouchableOpacity
              className="mb-6  rounded-2xl p-4 dark:bg-primary-dark"
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text className="text-center font-open-sans-bold text-white">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
