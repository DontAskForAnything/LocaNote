// TODO: Check on other device and improve design
import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types/navigation";
import { NavigationBar } from "../../components/navigationBar";
import { UsernameSchema } from "../../utils/schemas";
import { isClerkAPIResponseError } from "@clerk/clerk-js";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsernameChooseScreen({
  navigation,
}: RootStackScreenProps<"UsernameChoose">) {
  const [usernameError, setUsernameError] = React.useState("");
  const [username, setUsername] = React.useState("");

  const { isLoaded, signUp, setActive } = useSignUp();

  const onSignUpPress = async () => {
    if (!isLoaded) return <></>;

    setUsernameError("");
    const result = UsernameSchema.safeParse(username);

    if (!result.success) {
      const errors = result.error.format();
      setUsernameError(errors?._errors[0] ?? "");
      return;
    }

    try {
      await signUp.update({ username: username });
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        if (err.status !== 200 && err.status !== 422) {
          setUsernameError(err.errors[0]?.message ?? "");
          return;
        }

        if (err.errors) {
          const usernameError = err.errors.find(
            (error) => error.meta?.paramName === "username",
          );
          setUsernameError(usernameError?.longMessage ?? "");

          return;
        }
      }
    }
    setActive({ session: signUp.createdSessionId });
  };
  return (
    <View className="flex bg-background dark:bg-background-dark">
      <SafeAreaView className="relevant">
        <NavigationBar
          title="Sign Up"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View className="flex h-screen bg-background px-5 pt-4 dark:bg-background-dark">
          <Text className="text-center font-open-sans-bold text-white">
            Set your username
          </Text>
          <TextInput
            autoCapitalize="none"
            value={username}
            placeholder="Username"
            placeholderTextColor={"rgb(107,114,128)"}
            onChangeText={(username) => {
              setUsername(username);
            }}
            className="mb-4 mt-2 rounded-2xl bg-input p-4 font-open-sans-regular text-gray-500 dark:bg-input-dark  dark:text-white"
          />
          {usernameError && (
            <Text className="mt-2 font-open-sans-bold text-red-500">
              {usernameError}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className="absolute bottom-52 mt-4 w-6/12 self-center rounded-2xl bg-primary p-4   dark:bg-primary-dark"
          onPress={onSignUpPress}
        >
          <Text className="text-center font-open-sans-bold text-white">
            NEXT
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
