import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RootStackScreenProps } from "../../types/navigation";
import { NavigationBar } from "../../components/navigationBar";
import SignInWithOAuthButton from "../../components/SignInWithOAuth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpStrategyScreen({
  navigation,
}: RootStackScreenProps<"SignUpStrategy">) {
  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="flex bg-background dark:bg-background-dark">
        <NavigationBar title="Sign Up" onPress={() => navigation.goBack()} />
        <View className="h-screen bg-background px-5 pt-6 dark:bg-background-dark">
          <SignInWithOAuthButton
            oauth_strategy="oauth_facebook"
            themeVariant="facebook"
            text="Sign Up with Facebook"
            iconName="facebook"
            onNewAccount={() => navigation.navigate("UsernameChoose")}
          />

          <SignInWithOAuthButton
            oauth_strategy="oauth_google"
            themeVariant="google"
            text="Sign Up with Google"
            iconName="google"
            onNewAccount={() => navigation.navigate("UsernameChoose")}
          />

          <SignInWithOAuthButton
            oauth_strategy="oauth_apple"
            themeVariant="apple"
            text="Sign Up with Apple"
            iconName="apple"
            onNewAccount={() => navigation.navigate("UsernameChoose")}
          />

          {/* Separator */}
          <View className="mb-2 border-b border-gray-400 dark:border-white" />

          {/* Email button */}
          <TouchableOpacity
            className="mb-6 mt-4  rounded-2xl bg-primary p-4   dark:bg-primary-dark"
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text className="text-center font-open-sans-bold text-white">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
